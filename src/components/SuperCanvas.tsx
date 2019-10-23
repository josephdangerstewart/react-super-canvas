import React, { useEffect, useRef, useState } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';
import SuperCanvasManager from '../api/SuperCanvasManager';
import CircleCanvasItem from '../api/canvas-items/CircleCanvasItem';
import { vector } from '../utility/shapes-util';
import IBrush from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';

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
}

const canvasItems = [
	new CircleCanvasItem(vector(20, 20), 20),
];

export default ({
	height,
	width,
	availableBrushes,
	activeBackgroundElement,
}: SuperCanvasProps): React.ReactNode => {
	const canvasRef = useRef(null);
	const [ superCanvasManager, setSuperCanvasManager ] = useState<ISuperCanvasManager>(null);

	useEffect(() => {
		if (canvasRef.current && !superCanvasManager) {
			const manager = new SuperCanvasManager();
			manager.init(canvasRef.current);
			manager.setActiveBackgroundElement(activeBackgroundElement);
			manager.setCanvasItems(canvasItems);
			manager.setAvailableBrushes(availableBrushes);

			setSuperCanvasManager(manager);

			return (): void => {
				manager.destroy();
			};
		}

		return null;
	}, []);

	return (
		<canvas
			height={height}
			width={width}
			ref={canvasRef}
		/>
	);
};
