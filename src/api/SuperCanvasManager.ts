import ISuperCanvasManager from '../types/ISuperCanvasManager';
import IPainterAPI from '../types/IPainterAPI';
import PainterAPI from './PainterAPI';
import ICanvasItem from '../types/ICanvasItem';
import IBrush from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';
import CanvasItemContext from '../types/utility/CanvasItemContext';
import CanvasInteractionManager from './helpers/CanvasInteractionManager';

export default class SuperCanvasManager implements ISuperCanvasManager {
	/* PRIVATE MEMBERS */

	// The painter object used for drawing with virtual coordinates
	private painter: IPainterAPI;

	// The object that manages the canvas interactions such as panning and zoom
	private interactionManager: CanvasInteractionManager;

	// The active canvas items on the canvas
	private canvasItems: ICanvasItem[];

	// The available bushes the user can paint with
	private availableBrushes: IBrush[];

	// The active brush that the user is using
	private activeBrush: IBrush;

	// The active background element
	private activeBackgroundElement: IBackgroundElement;

	// Used for determining whether to keep updating (preventing memory leaks)
	private isActive: boolean;

	/* PUBLIC METHODS */

	init = (canvas: HTMLCanvasElement): void => {
		// This must be the first thing called
		this.interactionManager = new CanvasInteractionManager(canvas);
		this.painter = new PainterAPI(canvas.getContext('2d'), this.interactionManager.panOffset, this.interactionManager.scale);

		this.canvasItems = [];
		this.availableBrushes = [];

		this.isActive = true;

		this.update();
	};

	destroy = (): void => {
		this.isActive = false;
	};

	setCanvasItems = (items: ICanvasItem[]): void => {
		this.canvasItems = items;
	};

	getCanvasItems = (): ICanvasItem[] => this.canvasItems;

	setActiveBackgroundElement = (element: IBackgroundElement): void => {
		this.activeBackgroundElement = element;
	};

	setAvailableBrushes = (brushes: IBrush[]): void => {
		this.availableBrushes = brushes;
	};

	/* PRIVATE METHODS */

	update = (): void => {
		// This must be the first thing called
		this.interactionManager.update();
		this.painter.clearCanvas();

		this.painter.setPan(this.interactionManager.panOffset);
		this.painter.setScale(this.interactionManager.scale);

		this.canvasItems.forEach((item) => {
			const context = this.generateCanvasContextForItem();
			item.render(this.painter, context);
		});

		if (this.isActive) {
			requestAnimationFrame(this.update);
		}
	};

	generateCanvasContextForItem = (): CanvasItemContext => ({
		isSelected: false,
		mousePosition: this.interactionManager.mousePosition,
		absoluteMousePosition: this.interactionManager.absoluteMousePosition,
	});
}
