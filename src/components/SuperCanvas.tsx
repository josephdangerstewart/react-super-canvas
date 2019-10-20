import * as React from 'react';

export interface SuperCanvasProps {
	/**
	 * The height of the canvas element
	 */
	height: number;
}

export default ({ height }: SuperCanvasProps): React.ReactNode => (
	<canvas
		height={height}
	/>
);
