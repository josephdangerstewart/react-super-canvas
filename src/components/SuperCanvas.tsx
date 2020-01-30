import React, { useMemo } from 'react';
import IBrush, { DefaultBrushKind } from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';
import { useSuperCanvasManager } from '../hooks/use-super-canvas-manager';
import DefaultToolbar, { ToolbarProps } from './toolbar/DefaultToolbar';
import DefaultBrushControls, { BrushControlsProps } from './toolbar/DefaultBrushControls';
import DefaultStyleControls, { StyleControlsProps } from './toolbar/DefaultStyleControls';
import DefaultClearButton, { ClearButtonProps } from './toolbar/DefaultClearButton';
import SelectionBrush from '../api/brushes/SelectionBrush';
import { OnCanvasItemChangeCallback } from '../types/callbacks/OnCanvasItemChangeCallback';

export interface ToolbarComponents {
	Toolbar?: React.ComponentType<ToolbarProps>;
	BrushControls?: React.ComponentType<BrushControlsProps>;
	StyleControls?: React.ComponentType<StyleControlsProps>;
	ClearButton?: React.ComponentType<ClearButtonProps>;
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
}

const SuperCanvas: React.FunctionComponent<SuperCanvasProps> = ({
	height,
	width,
	availableBrushes: providedBrushes,
	activeBackgroundElement,
	toolbarComponents,
	onChange,
}) => {
	const availableBrushes = useMemo(() => {
		if (!providedBrushes.find((brush) => brush.brushName === DefaultBrushKind.Selection)) {
			return [ new SelectionBrush(), ...providedBrushes ];
		}

		return providedBrushes;
	}, [ providedBrushes ]);

	const {
		canvasRef,
		superCanvasManager,
		activeBrushName,
		styleContext,
	} = useSuperCanvasManager(activeBackgroundElement, availableBrushes, onChange);
	const {
		Toolbar: CustomToolbar,
		BrushControls: CustomBrushControls,
		StyleControls: CustomStyleControls,
		ClearButton: CustomClearButton,
	} = (toolbarComponents || {}) as ToolbarComponents;

	const Toolbar = CustomToolbar || DefaultToolbar as React.ComponentType<ToolbarProps>;
	const BrushControls = CustomBrushControls || DefaultBrushControls as React.ComponentType<BrushControlsProps>;
	const StyleControls = CustomStyleControls || DefaultStyleControls as React.ComponentType<StyleControlsProps>;
	const ClearButton = CustomClearButton || DefaultClearButton as React.ComponentType<ClearButtonProps>;

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
						/>
					)}
					clearButton={(
						<ClearButton
							clear={superCanvasManager && superCanvasManager.clear}
						/>
					)}
				/>
			)}
		</div>
	);
};

export default SuperCanvas;
