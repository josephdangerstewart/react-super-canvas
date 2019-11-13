import React from 'react';
import IBrush from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';
import { RenderToolbarCallback } from '../types/callbacks/RenderToolbarCallback';
import { useSuperCanvasManager } from '../hooks/use-super-canvas-manager';
import { renderDefaultToolbar } from './DefautltToolbar';

export interface SuperCanvasProps {
	/**
	 * The height of the canvas element
	 */
	height: number;

	/**
	 * The width of the canvas element
	 */
	width: number;

	/**
	 * The available brushes that the editor recognizes
	 */
	availableBrushes: IBrush[];

	/**
	 * The active background element
	 */
	activeBackgroundElement: IBackgroundElement;

	/**
	 * The render function for rendering a custom toolbar
	 */
	renderToolbar?: RenderToolbarCallback;
}

export default ({
	height,
	width,
	availableBrushes,
	activeBackgroundElement,
	renderToolbar: customRenderToolbar,
}: SuperCanvasProps): React.ReactNode => {
	const { canvasRef, superCanvasManager } = useSuperCanvasManager(activeBackgroundElement, availableBrushes);

	const renderToolbar = customRenderToolbar || renderDefaultToolbar;

	return (
		<div>
			<canvas
				height={height}
				width={width}
				ref={canvasRef}
			/>
			{superCanvasManager && renderToolbar(superCanvasManager.setActiveBrush, availableBrushes)}
		</div>
	);
};
