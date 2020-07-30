import React, {
	useMemo, useState, useCallback, forwardRef, useImperativeHandle,
} from 'react';
import IBrush, { DefaultBrushKind } from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';
import { useSuperCanvasManager } from '../hooks/use-super-canvas-manager';
import DefaultToolbar, { ToolbarProps } from './toolbar/DefaultToolbar';
import DefaultBrushControls, { BrushControlsProps } from './toolbar/DefaultBrushControls';
import DefaultStyleControls, { StyleControlsProps } from './toolbar/DefaultStyleControls';
import DefaultCanvasControls, { CanvasControlsProps } from './toolbar/DefaultCanvasControls';
import SelectionBrush from '../api/brushes/SelectionBrush';
import { OnCanvasItemChangeCallback } from '../types/callbacks/OnCanvasItemChangeCallback';
import ISelection from '../types/ISelection';
import { Renderable } from '../types/Renderable';
import { ClipboardEventCallback } from '../types/callbacks/ClipboardEventCallback';
import Vector2D from '../types/utility/Vector2D';
import { vector } from '../utility/shapes-util';

const CANVAS_ITEM_MIME_TYPE = 'application/json';

export interface ToolbarComponents {
	Toolbar?: React.ComponentType<ToolbarProps>;
	BrushControls?: React.ComponentType<BrushControlsProps>;
	StyleControls?: React.ComponentType<StyleControlsProps>;
	CanvasControls?: React.ComponentType<CanvasControlsProps>;
}

export interface SuperCanvasProps {
	/**
	 * @description The height of the canvas element
	 */
	height: number;

	/**
	 * @description The width of the canvas element
	 */
	width: number;

	/**
	 * @description The available brushes that the editor recognizes
	 */
	availableBrushes: IBrush[];

	/**
	 * @description The active background element
	 */
	activeBackgroundElement: IBackgroundElement;

	/**
	 * @description Optional replaceable components for the toolbar
	 */
	toolbarComponents?: ToolbarComponents;

	/**
	 * @description Called when the items on the super canvas change
	 */
	onChange?: OnCanvasItemChangeCallback;

	/**
	 * @description The initial contents of the editor. Note that this
	 * component cannot currently be controlled.
	 */
	initialValue?: Renderable[];

	/**
	 * @description An event that is fired when the user copies canvas items
	 * to the clipboard
	 */
	onCopy?: ClipboardEventCallback;

	/**
	 * @description An event that is fired when the user pastes canvas items
	 * to the canvas
	 */
	onPaste?: ClipboardEventCallback;

	/**
	 * @description Optionally disable pasting to the canvas
	 * @default false
	 */
	disablePaste?: boolean;

	/**
	 * @description Optionally disable copying to the canvas
	 * @default false
	 */
	disableCopy?: boolean;

	/**
	 * @description How much canvas items should be translated when they are
	 * pasted, default is (0, 0)
	 */
	translationOnPaste?: Vector2D;
}

export interface SuperCanvasImperativeHandle {
	/**
	 * @description Changes the brush that is currently brush
	 */
	setActiveBrush: (brushName: string) => void;

	/**
	 * @description Undos the last action
	 */
	undo: () => void;

	/**
	 * @description Redos the last undone action
	 */
	redo: () => void;

	/**
	 * @description Locks the current selection
	 */
	lockCurrentSelection: () => void;

	/**
	 * @description Unlocks the current selection
	 */
	unlockCurrentSelection: () => void;
}

const SuperCanvas: React.ForwardRefExoticComponent<SuperCanvasProps> = forwardRef<SuperCanvasImperativeHandle, SuperCanvasProps>(
	(
		{
			height,
			width,
			availableBrushes: providedBrushes,
			activeBackgroundElement,
			toolbarComponents,
			onChange,
			initialValue,
			onCopy: onCopyHook,
			onPaste: onPasteHook,
			disableCopy,
			disablePaste,
			translationOnPaste,
		},
		ref,
	) => {
		const availableBrushes = useMemo(() => {
			if (!providedBrushes.find((brush) => brush.brushName === DefaultBrushKind.Selection)) {
				return [ new SelectionBrush(), ...providedBrushes ];
			}

			return providedBrushes;
		}, [ providedBrushes ]);

		const [ selection, setSelection ] = useState(null);
		const handleSelectionChange = useCallback((curSelection: ISelection): void => {
			if (curSelection.selectedItem) {
				setSelection(curSelection);
			} else {
				setSelection(null);
			}
		}, []);

		const {
			canvasRef,
			superCanvasManager,
			activeBrushName,
			styleContext,
		} = useSuperCanvasManager(activeBackgroundElement, availableBrushes, onChange, initialValue, handleSelectionChange);

		useImperativeHandle(
			ref,
			() => superCanvasManager && ({
				setActiveBrush: superCanvasManager?.setActiveBrushByName,
				undo: superCanvasManager?.undo,
				redo: superCanvasManager?.redo,
				lockCurrentSelection: superCanvasManager?.lockCurrentSelection,
				unlockCurrentSelection: superCanvasManager?.unlockCurrentSelection,
			}),
			[ superCanvasManager ],
		);

		const onCopy = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
			if (disableCopy) {
				event.preventDefault();
				return;
			}

			const currentSelection = superCanvasManager.getSelection();

			if (currentSelection.selectedItemCount === 0) {
				event.preventDefault();
				return;
			}

			const renderables = superCanvasManager.serializeCurrentSelection();
			const serializedSnapshot = JSON.stringify({
				kind: 'canvasitem',
				renderables,
			});
			event.clipboardData.setData(CANVAS_ITEM_MIME_TYPE, serializedSnapshot);

			if (onCopyHook) {
				onCopyHook(currentSelection);
			}

			event.preventDefault();
		}, [ disableCopy, superCanvasManager, onCopyHook ]);

		const onPaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
			if (disablePaste) {
				event.preventDefault();
				return;
			}

			const serializedData = event.clipboardData.getData(CANVAS_ITEM_MIME_TYPE);

			if (!serializedData) {
				event.preventDefault();
				return;
			}

			const jsonData = JSON.parse(serializedData);

			if (!jsonData || jsonData.kind !== 'canvasitem') {
				event.preventDefault();
				return;
			}

			superCanvasManager.paste(jsonData.renderables as Renderable[], translationOnPaste ?? vector(0, 0));

			if (onPasteHook) {
				onPasteHook(superCanvasManager.getSelection());
			}

			event.preventDefault();
		}, [ disablePaste, superCanvasManager, onPasteHook, translationOnPaste ]);

		const {
			Toolbar: CustomToolbar,
			BrushControls: CustomBrushControls,
			StyleControls: CustomStyleControls,
			CanvasControls: CustomCanvasControls,
		} = (toolbarComponents || {}) as ToolbarComponents;

		const Toolbar = CustomToolbar || DefaultToolbar as React.ComponentType<ToolbarProps>;
		const BrushControls = CustomBrushControls || DefaultBrushControls as React.ComponentType<BrushControlsProps>;
		const StyleControls = CustomStyleControls || DefaultStyleControls as React.ComponentType<StyleControlsProps>;
		const CanvasControls = CustomCanvasControls || DefaultCanvasControls as React.ComponentType<CanvasControlsProps>;

		return (
			<div
				style={{ position: 'relative' }}
				onCopy={onCopy}
				onPaste={onPaste}
			>
				<canvas
					height={height}
					width={width}
					ref={canvasRef}
				/>
				{superCanvasManager && (
					<Toolbar
						brushControls={(
							<BrushControls
								setActiveBrush={superCanvasManager.setActiveBrush}
								brushes={availableBrushes}
								activeBrushName={activeBrushName}
							/>
						)}
						styleControls={(
							<StyleControls
								setStyleContext={superCanvasManager.setStyleContext}
								styleContext={styleContext}
								activeBrushName={activeBrushName}
								currentSelection={selection}
							/>
						)}
						canvasControls={(
							<CanvasControls
								clear={superCanvasManager && superCanvasManager.clear}
								currentSelection={selection}
								deleteSelectedCanvasItems={superCanvasManager && superCanvasManager.deleteSelectedCanvasItem}
							/>
						)}
					/>
				)}
			</div>
		);
	},
);

export default SuperCanvas;
