import React, { useEffect, useRef, useState } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';
import SuperCanvasManager from '../api/SuperCanvasManager';
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
