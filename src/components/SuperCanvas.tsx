import React, { useEffect, useRef } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';
import SuperCanvasManager from '../api/SuperCanvasManager';
import DefaultBackgroundElement from '../api/background-elements/DefaultBackgroundElement';
import CircleCanvasItem from '../api/canvas-items/CircleCanvasItem';
import { vector } from '../utility/shapes-util';

export interface SuperCanvasProps {
	/**
	 * The height of the canvas element
	 */
	height: number;
}

let superCanvasManager: ISuperCanvasManager;
const background = new DefaultBackgroundElement();
const canvasItems = [
	new CircleCanvasItem(vector(20, 20), 20),
];

export default ({ height }: SuperCanvasProps): React.ReactNode => {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (canvasRef.current && !superCanvasManager) {
			superCanvasManager = new SuperCanvasManager();
			superCanvasManager.init(canvasRef.current);
			superCanvasManager.setActiveBackgroundElement(background);
			superCanvasManager.setCanvasItems(canvasItems);
		}
	}, []);

	return (
		<canvas
			height={height}
			ref={canvasRef}
		/>
	);
};
