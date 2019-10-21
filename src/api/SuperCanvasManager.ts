import ISuperCanvasManager from '../types/ISuperCanvasManager';
import IPainterAPI from '../types/IPainterAPI';
import PainterAPI from './PainterAPI';
import Vector2D from '../types/utility/Vector2D';
import { vector } from '../utility/shapes-util';
import ICanvasItem from '../types/ICanvasItem';
import IBrush from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';

export default class SuperCanvasManager implements ISuperCanvasManager {
	// The painter object used for drawing with virtual coordinates
	private painter: IPainterAPI;

	// The offset of the panning. (10, 10) would put the origin at (-10, -10)
	private panOffset: Vector2D;

	// The zoom factor
	private scale: number;

	// The active canvas items on the canvas
	private canvasItems: ICanvasItem[];

	// The available bushes the user can paint with
	private availableBrushes: IBrush[];

	// The active brush that the user is using
	private activeBrush: IBrush;

	// The active background element
	private activeBackgroundElement: IBackgroundElement;

	init = (canvas: HTMLCanvasElement): void => {
		this.panOffset = vector(0, 0);
		this.scale = 1.0;
		this.painter = new PainterAPI(canvas.getContext('2d'), this.panOffset, this.scale);
	};
}
