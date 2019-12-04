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
import { MouseEventKind } from '../types/callbacks/DomEventKinds';
import StyleContext, { defaultStyleContext } from '../types/context/StyleContext';
import { ActiveBrushChangeCallback } from '../types/callbacks/ActiveBrushChangeCallback';
import { StyleContextChangeCallback } from '../types/callbacks/StyleContextChangeCallback';

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

	// Allows users to set color/stroke settings
	private styleContext: StyleContext;

	// The custom callback when the active brush changes
	private _onActiveBrushChange: ActiveBrushChangeCallback;

	// The custom callback when the style context changes
	private _onStyleContextChange: StyleContextChangeCallback;

	/* PUBLIC METHODS */

	init = (canvas: HTMLCanvasElement): void => {
		// This must be the first thing called because it attaches event listeners
		this.interactionManager = new CanvasInteractionManager(canvas);
		this.context2d = canvas.getContext('2d');
		this.painter = new PainterAPI(this.context2d, this.interactionManager.panOffset, this.interactionManager.scale);

		this.canvasItems = [];
		this.availableBrushes = [];
		this.styleContext = defaultStyleContext;

		this.isActive = true;

		this.interactionManager.registerMouseEvent(MouseEventKind.MouseDown, this.onMouseDown);

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

		if (this.availableBrushes && this.availableBrushes.length > 0) {
			[ this.activeBrush ] = this.availableBrushes;
		}
	};

	setActiveBrush = (brush: IBrush): void => {
		this.activeBrush = brush;
		if (this.onActiveBrushChange) {
			this._onActiveBrushChange(this.activeBrush);
		}
	};

	setStyleContext = (styleContext: StyleContext): void => {
		const copy = { ...styleContext };
		if (styleContext.fillImageUrl && styleContext.fillColor) {
			console.warn('Both fillImageUrl and fillColor were provided: fillImageUrl will be overridden');
			copy.fillImageUrl = null;
		}

		this.styleContext = {
			...this.styleContext,
			...copy,
		};

		if (this._onStyleContextChange) {
			this._onStyleContextChange(this.styleContext);
		}
	};

	onActiveBrushChange = (onChange: ActiveBrushChangeCallback): void => {
		onChange(this.activeBrush);
		this._onActiveBrushChange = onChange;
	};

	onStyleContextChange = (onChange: StyleContextChangeCallback): void => {
		onChange(this.styleContext);
		this._onStyleContextChange = onChange;
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
			this.activeBrush.renderPreview(this.painter, this.generateBrushContext());
		}

		if (this.isActive) {
			requestAnimationFrame(this.update);
		}
	};

	private generateContext = (): Context => ({
		mousePosition: this.interactionManager.mousePosition,
		absoluteMousePosition: this.interactionManager.absoluteMousePosition,
		isPanning: this.interactionManager.isPanning,
		styleContext: { ...this.styleContext },
	});

	private generateCanvasContextForItem = (): CanvasItemContext => ({
		...this.generateContext(),
		isSelected: false,
	});

	private generateBackgroundElementContext = (): BackgroundElementContext => ({
		...this.generateContext(),
		virtualTopLeftCorner: this.interactionManager.virtualTopLeftCorner,
		scale: this.interactionManager.scale,
	});

	private generateBrushContext = (): BrushContext => ({
		...this.generateContext(),
		snappedMousePosition: this.activeBackgroundElement
			? this.activeBackgroundElement.mapMouseCoordinates(this.interactionManager.mousePosition)
			: this.interactionManager.mousePosition,
	});

	private onMouseDown = (): void => {
		if (this.activeBrush) {
			this.activeBrush.mouseDown(this.addCanvasItem, this.generateBrushContext());
		}
	};

	private addCanvasItem = (canvasItem: ICanvasItem): void => {
		this.canvasItems.push(canvasItem);
	};
}
