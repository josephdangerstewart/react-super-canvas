import ISuperCanvasManager from '../types/ISuperCanvasManager';
import IPainterAPI from '../types/IPainterAPI';
import PainterAPI from './PainterAPI';
import ICanvasItem from '../types/ICanvasItem';
import IBrush from '../types/IBrush';
import IBackgroundElement from '../types/IBackgroundElement';
import CanvasItemContext from '../types/context/CanvasItemContext';
import CanvasInteractionManager from './helpers/CanvasInteractionManager';
import BackgroundElementContext from '../types/context/BackgroundElementContext';
import Context from '../types/context/Context';
import { BrushContext } from '../types/context/BrushContext';

export default class SuperCanvasManager implements ISuperCanvasManager {
	/* PRIVATE MEMBERS */

	// The painter object used for drawing with virtual coordinates
	private painter: IPainterAPI;

	// The canvas rendering context to be passed to the active background element for rendering
	private context2d: CanvasRenderingContext2D;

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
		// This must be the first thing called because it attaches event listeners
		this.interactionManager = new CanvasInteractionManager(canvas);
		this.context2d = canvas.getContext('2d');
		this.painter = new PainterAPI(this.context2d, this.interactionManager.panOffset, this.interactionManager.scale);

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

	private update = (): void => {
		// This must be the first thing called
		this.interactionManager.update();
		this.painter.clearCanvas();

		this.painter.setPan(this.interactionManager.panOffset);
		this.painter.setScale(this.interactionManager.scale);

		if (this.activeBackgroundElement) {
			this.activeBackgroundElement.renderBackground(this.painter, this.context2d, this.generateBackgroundElementContext());
		}

		this.canvasItems.forEach((item) => {
			const context = this.generateCanvasContextForItem();
			item.render(this.painter, context);
		});

		if (this.activeBrush) {
			this.activeBrush.renderPreview(this.painter, this.context2d, this.generateBrushContext());
		}

		if (this.isActive) {
			requestAnimationFrame(this.update);
		}
	};

	private generateContext = (): Context => ({
		mousePosition: this.interactionManager.mousePosition,
		absoluteMousePosition: this.interactionManager.absoluteMousePosition,
		isPanning: this.interactionManager.isPanning,
	});

	private generateCanvasContextForItem = (): CanvasItemContext => ({
		...this.generateContext(),
		isSelected: false,
	});

	private generateBackgroundElementContext = (): BackgroundElementContext => ({
		...this.generateContext(),
		virtualTopLeftCorner: this.interactionManager.virtualTopLeftCorner,
	});

	private generateBrushContext = (): BrushContext => ({
		...this.generateContext(),
		snappedMousePosition: this.activeBackgroundElement
			? this.activeBackgroundElement.mapMouseCoordinates(this.interactionManager.mousePosition)
			: this.interactionManager.mousePosition,
	});
}
