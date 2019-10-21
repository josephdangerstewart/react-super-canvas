import React, { useEffect, useRef } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';

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
		if (canvasRef.current) {
			console.log(canvasRef.current, 'from mounted!');
			// superCanvasManager.init(canvasRef.current as HTMLCanvasElement);
		}
	}, []);

	return (
		<canvas
			height={height}
			ref={canvasRef}
		/>
	);
};
