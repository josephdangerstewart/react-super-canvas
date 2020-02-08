import ISuperCanvasManager from '../types/ISuperCanvasManager';
import PainterAPI from './PainterAPI';
import ICanvasItem from '../types/ICanvasItem';
import IBrush, { DefaultBrushKind } from '../types/IBrush';
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
import SelectionManager from './helpers/SelectionManager';
import { TransformManager } from './helpers/TransformManager';
import ActionHistoryManager, { ActionType, TransformAction, ActionRecord } from './helpers/ActionHistoryManager';
import { IImageCache } from '../types/IImageCache';
import ImageCache from './ImageCache';
import { OnCanvasItemChangeCallback } from '../types/callbacks/OnCanvasItemChangeCallback';
import JsonData from '../types/utility/JsonData';
import Type from '../types/utility/Type';
import ISelection from '../types/ISelection';
import { OnSelectionChangeCallback } from '../types/callbacks/OnSelectionChangeCallback';
import { createSelection } from '../utility/selection-utility';

export default class SuperCanvasManager implements ISuperCanvasManager {
	/* PRIVATE MEMBERS */

	// The painter object used for drawing with virtual coordinates
	private painter: PainterAPI;

	// The canvas rendering context to be passed to the active background element for rendering
	private context2d: CanvasRenderingContext2D;

	// The object that manages the canvas interactions such as panning and zoom
	private interactionManager: CanvasInteractionManager;

	// The object that manages the selected canvas items
	private selectionManager: SelectionManager;

	// The object that manages transformations on canvas items
	private transformManager: TransformManager;

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

	// Caches images
	private imageCache: IImageCache;

	// The custom callback when the active brush changes
	private _onActiveBrushChange: ActiveBrushChangeCallback;

	// The custom callback when the style context changes
	private _onStyleContextChange: StyleContextChangeCallback;

	// The custom callback when canvas items change
	private _onCanvasItemChange: OnCanvasItemChangeCallback;

	// The action history manager for handling undo, redo management
	private actionHistoryManager: ActionHistoryManager;

	/* PUBLIC METHODS */

	init = (canvas: HTMLCanvasElement): void => {
		// This must be the first thing called because it attaches event listeners
		this.interactionManager = new CanvasInteractionManager(canvas);
		this.context2d = canvas.getContext('2d');
		this.actionHistoryManager = new ActionHistoryManager();
		this.selectionManager = new SelectionManager(this.interactionManager);
		this.transformManager = new TransformManager(this.selectionManager, this.handleCanvasItemsChange, this.actionHistoryManager);
		this.imageCache = new ImageCache(this.context2d);
		this.painter = new PainterAPI(this.context2d, this.interactionManager.panOffset, this.interactionManager.scale, this.imageCache);

		this.canvasItems = [];
		this.availableBrushes = [];
		this.styleContext = defaultStyleContext;

		this.isActive = true;

		this.interactionManager.registerMouseEvent(MouseEventKind.MouseDown, this.onMouseDown);
		this.interactionManager.registerMouseEvent(MouseEventKind.MouseUp, this.onMouseUp);
		this.interactionManager.registerMouseEvent(MouseEventKind.MouseMove, this.onMouseDrag);

		this.update();
	};

	destroy = (): void => {
		this.isActive = false;
	};

	onCanvasItemsChange = (onChange: OnCanvasItemChangeCallback): void => {
		this._onCanvasItemChange = onChange;
	};

	setCanvasItems = (items: JsonData[]): void => {
		const availableCanvasItems = this.availableBrushes
			.reduce(
				(dictionary, brush) => ({
					...dictionary,
					...brush.supportedCanvasItems,
				}),
				{},
			) as Record<string, Type<ICanvasItem>>;

		this.canvasItems = items.map((data = {}) => {
			const { item, canvasItemName } = data;
			const CanvasItemClass = availableCanvasItems[canvasItemName as string];

			if (CanvasItemClass) {
				const canvasItem = new CanvasItemClass();
				canvasItem.fromJson(item as JsonData);
				return { ...canvasItem, $rotation: 0 };
			}
			return null;
		}).filter(Boolean);
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
			// eslint-disable-next-line
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

	clear = (): void => {
		this.selectionManager.deselectItems();
		this.actionHistoryManager.recordDeleteCanvasItems([ ...this.canvasItems ]);
		this.canvasItems = [];
		this.handleCanvasItemsChange();
	};

	deleteSelectedCanvasItem = (): void => {
		const items = this.selectionManager.selectedItems;
		this.actionHistoryManager.recordDeleteCanvasItems([ ...items ]);
		this.canvasItems = this.canvasItems.filter((item) => !items.includes(item));
		this.handleCanvasItemsChange();
	};

	getSelection = (): ISelection => this.selectionManager;

	onSelectionChange = (onChange: OnSelectionChangeCallback): void => {
		this.selectionManager.onSelectionChange(() => {
			onChange(this.selectionManager);
		});
	};

	setActiveBrushByName = (brushName: string): void => {
		const brush = this.availableBrushes.find((b) => b.brushName === brushName);
		if (brush) {
			this.setActiveBrush(brush);
		}
	};

	undo = (): void => {
		const action = this.actionHistoryManager.getNextUndoAction();
		this.applyAction(action);
	};

	redo = (): void => {
		const action = this.actionHistoryManager.getNextRedoAction();
		this.applyAction(action);
	};

	/* PRIVATE METHODS */

	private applyAction = (action: ActionRecord): void => {
		if (!action) {
			return;
		}

		switch (action.type) {
			case ActionType.DeleteCanvasItems:
				this.canvasItems = this.canvasItems.filter((item) => !action.data.canvasItems.includes(item));
				break;
			case ActionType.AddCanvasItems:
				this.canvasItems.push(...action.data.canvasItems);
				break;
			case ActionType.TransformCanvasItems:
				const data = (action.data as TransformAction);
				this.transformManager.applyTransform(data.transformOperation, createSelection(data.canvasItems));
				break;
			default:
				break;
		}

		if (this.selectionManager.selectedItems.some((item) => !this.canvasItems.includes(item))) {
			this.selectionManager.deselectItems();
		}
	};

	private update = (): void => {
		// This must be the first thing called
		this.interactionManager.update();
		this.painter.clearCanvas();
		this.painter.beginCursorState();

		this.painter.setPan(this.interactionManager.panOffset);
		this.painter.setScale(this.interactionManager.scale);

		if (this.activeBackgroundElement) {
			this.activeBackgroundElement.renderBackground(this.painter, this.context2d, this.generateBackgroundElementContext());
		}

		this.canvasItems.forEach((item) => {
			const context = this.generateCanvasContextForItem(item);
			item.render(this.painter, context);
		});

		this.transformManager.render(this.painter, this.generateBrushContext());

		if (this.activeBrush) {
			this.activeBrush.renderPreview(this.painter, this.generateBrushContext());
		}

		this.imageCache.clearCache(5000);
		this.painter.endCursorState();
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

	private generateCanvasContextForItem = (item: ICanvasItem): CanvasItemContext => ({
		...this.generateContext(),
		isSelected: this.selectionManager.selectedItems.includes(item),
		imageCache: this.imageCache,
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
		imageCache: this.imageCache,
	});

	private onMouseDown = (): void => {
		if (this.activeBrush && this.activeBrush.brushName === DefaultBrushKind.Selection) {
			this.transformManager.mouseDown(this.generateBrushContext());
			this.selectionManager.mouseDown();
		} else if (this.activeBrush) {
			this.activeBrush.mouseDown(this.addCanvasItem, this.generateBrushContext());
		}
	};

	private onMouseUp = (): void => {
		if (this.activeBrush && this.activeBrush.brushName === DefaultBrushKind.Selection) {
			this.transformManager.mouseUp();
			this.selectionManager.mouseUp(this.generateContext(), this.canvasItems);
		}
	};

	private onMouseDrag = (): void => {
		if (this.activeBrush && this.activeBrush.brushName === DefaultBrushKind.Selection) {
			this.transformManager.mouseDragged(this.generateBrushContext());
			this.selectionManager.mouseDragged();
		}
	};

	private addCanvasItem = (item: ICanvasItem): void => {
		this.canvasItems.push(item);
		this.actionHistoryManager.recordAddCanvasItems([ item ]);
		this.handleCanvasItemsChange();
	};

	private handleCanvasItemsChange = (): void => {
		if (this._onCanvasItemChange) {
			const data = this.getCanvasItems()
				.map((canvasItem) => ({
					item: canvasItem.toJson(),
					canvasItemName: canvasItem.canvasItemName,
				}));

			this._onCanvasItemChange(data);
		}

		if (!this.getCanvasItems().length) {
			this.selectionManager.deselectItems();
		}
	};
}
