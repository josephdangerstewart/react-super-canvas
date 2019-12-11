import React from 'react';
import IBrush from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';
import { useSuperCanvasManager } from '../hooks/use-super-canvas-manager';
import DefaultToolbar, { ToolbarProps } from './toolbar/DefaultToolbar';
import DefaultBrushControls, { BrushControlsProps } from './toolbar/DefaultBrushControls';
import DefaultStyleControls, { StyleControlsProps } from './toolbar/DefaultStyleControls';
import DefaultClearButton, { ClearButtonProps } from './toolbar/DefaultClearButton';

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
}

const SuperCanvas: React.FunctionComponent<SuperCanvasProps> = ({
	height,
	width,
	availableBrushes,
	activeBackgroundElement,
	toolbarComponents,
}) => {
	const {
		canvasRef,
		superCanvasManager,
		activeBrushName,
		styleContext,
	} = useSuperCanvasManager(activeBackgroundElement, availableBrushes);
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
