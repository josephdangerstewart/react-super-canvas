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
import JsonData from '../types/utility/JsonData';
import ISelection from '../types/ISelection';

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
	initialValue?: JsonData[];
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
				setActiveBrush: superCanvasManager && superCanvasManager.setActiveBrushByName,
				undo: superCanvasManager && superCanvasManager.undo,
				redo: superCanvasManager && superCanvasManager.redo,
			}),
			[ superCanvasManager ],
		);

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
			<div style={{ position: 'relative' }}>
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
