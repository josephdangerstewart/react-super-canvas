import React, { useEffect, useRef } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';
import SuperCanvasManager from '../api/SuperCanvasManager';

export interface SuperCanvasProps {
	/**
	 * The height of the canvas element
	 */
	height: number;
}

// eslint-disable-next-line
let superCanvasManager: ISuperCanvasManager;

export default ({ height }: SuperCanvasProps): React.ReactNode => {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (canvasRef.current && !superCanvasManager) {
			superCanvasManager = new SuperCanvasManager();
			superCanvasManager.init(canvasRef.current);
		}
	}, []);

	return (
		<canvas
			height={height}
			ref={canvasRef}
		/>
	);
};
