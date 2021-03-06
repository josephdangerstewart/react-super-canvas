import ISuperCanvasManager from '../types/ISuperCanvasManager';
import PainterAPI from './PainterAPI';
import ICanvasItem from '../types/ICanvasItem';
import { CanvasItemInstance } from '../types/utility/CanvasItemInstance';
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
import Type from '../types/utility/Type';
import ISelection from '../types/ISelection';
import { OnSelectionChangeCallback } from '../types/callbacks/OnSelectionChangeCallback';
import { createSelection } from '../utility/selection-utility';
import { Renderable } from '../types/Renderable';
import { RenderableCanvasItem } from './canvas-items/RenderableCanvasItem';
import { generateRenderable } from '../utility/renderable-utility';
import Vector2D from '../types/utility/Vector2D';

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
	private canvasItems: CanvasItemInstance[];

	// The next canvas item instance id
	private nextCanvasItemInstanceId: number;

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
		this.nextCanvasItemInstanceId = 0;

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

	setCanvasItems = (items: Renderable[]): void => {
		this.canvasItems = this.fromRenderables(items);
	};

	getCanvasItems = (): ICanvasItem[] => this.canvasItems.map(({ canvasItem }) => canvasItem);

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
		const items = this.selectionManager.getSelectedInstances();
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

	paste = (items: Renderable[], translateOnPaste: Vector2D): void => {
		const instances = this.fromRenderables(items);

		this.selectionManager.setSelectedItems(instances);

		if (this.selectionManager.canMove) {
			this.selectionManager.selectedItems.forEach((item) => item.applyMove(translateOnPaste));
		}

		this.canvasItems.push(...instances);

		this.actionHistoryManager.recordAddCanvasItems(instances);
		this.handleCanvasItemsChange();
	};

	serializeCurrentSelection = (): Renderable[] => {
		const instances = [];
		for (let i = 0; i < this.canvasItems.length; i++) {
			const cur = this.canvasItems[i];
			if (this.selectionManager.isSelected(cur)) {
				instances.push(cur);
			}
		}

		return instances.map(generateRenderable);
	};

	lockCurrentSelection = (): void => {
		const instances = this.selectionManager.getSelectedInstances();
		for (let i = 0; i < instances.length; i++) {
			instances[i].metadata.isLocked = true;
		}
		this.actionHistoryManager.recordLockItems(instances);
		this.selectionManager.deselectItems();
		this.handleCanvasItemsChange();
	};

	unlockCurrentSelection = (): void => {
		const instances = this.selectionManager.getSelectedInstances();
		for (let i = 0; i < instances.length; i++) {
			instances[i].metadata.isLocked = false;
		}
		this.actionHistoryManager.recordUnlockItems(instances);
		this.handleCanvasItemsChange();
	};

	moveCurrentSelectionForward = (): void => {
		const previous = this.canvasItems.slice();
		for (let i = this.canvasItems.length - 2; i >= 0; i--) {
			const aheadInstance = this.canvasItems[i + 1];
			const curInstance = this.canvasItems[i];

			if (this.selectionManager.isSelected(curInstance)) {
				if (!this.selectionManager.isSelected(aheadInstance)) {
					this.swapCanvasItems(i, i + 1);
				}
			}
		}
		this.actionHistoryManager.recordRearrange(previous, this.canvasItems);
	};

	moveCurrentSelectionBack = (): void => {
		const previous = this.canvasItems.slice();
		for (let i = 1; i < this.canvasItems.length; i++) {
			const aheadInstance = this.canvasItems[i - 1];
			const curInstance = this.canvasItems[i];

			if (this.selectionManager.isSelected(curInstance)) {
				if (!this.selectionManager.isSelected(aheadInstance)) {
					this.swapCanvasItems(i, i - 1);
				}
			}
		}
		this.actionHistoryManager.recordRearrange(previous, this.canvasItems);
	};

	moveCurrentSelectionToFront = (): void => {
		const previous = this.canvasItems.slice();
		const selection = [];

		for (let i = 0; i < this.canvasItems.length; i++) {
			const cur = this.canvasItems[i];
			if (this.selectionManager.isSelected(cur)) {
				const [ item ] = this.canvasItems.splice(i, 1);
				i--;
				selection.push(item);
			}
		}

		this.canvasItems.push(...selection);
		this.actionHistoryManager.recordRearrange(previous, this.canvasItems);
	};

	moveCurrentSelectionToBack = (): void => {
		const previous = this.canvasItems.slice();
		const selection = [];

		for (let i = 0; i < this.canvasItems.length; i++) {
			const cur = this.canvasItems[i];
			if (this.selectionManager.isSelected(cur)) {
				const [ item ] = this.canvasItems.splice(i, 1);
				i--;
				selection.push(item);
			}
		}

		this.canvasItems.unshift(...selection);
		this.actionHistoryManager.recordRearrange(previous, this.canvasItems);
	};

	/* PRIVATE METHODS */

	private swapCanvasItems = (i1: number, i2: number): void => {
		if (i1 === i2) {
			return;
		}

		const temp = this.canvasItems[i1];
		this.canvasItems[i1] = this.canvasItems[i2];
		this.canvasItems[i2] = temp;
	};

	private fromRenderables = (renderables: Renderable[]): CanvasItemInstance[] => {
		const availableCanvasItems = this.availableBrushes
			.reduce(
				(dictionary, brush) => ({
					...dictionary,
					...brush.supportedCanvasItems,
				}),
				{},
			) as Record<string, Type<ICanvasItem>>;

		return renderables.map((renderable): CanvasItemInstance => {
			if (!renderable) {
				return null;
			}

			const { canvasItemName, item } = renderable.canvasItemJson ?? {};
			const CanvasItemClass = availableCanvasItems[canvasItemName as string];

			let canvasItem: ICanvasItem = null;
			if (CanvasItemClass) {
				canvasItem = new CanvasItemClass(item);
			} else {
				canvasItem = new RenderableCanvasItem({ renderable, imageCache: this.imageCache });
			}

			return {
				canvasItem,
				metadata: renderable.metadata ?? {},
				id: this.getNextCanvasItemInstanceId(),
			};
		});
	};

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
			case ActionType.LockCanvasItems:
				const itemIdsToLock = new Set(action.data.canvasItems.map((x) => x.id));
				for (let i = 0; i < this.canvasItems.length; i++) {
					const item = this.canvasItems[i];

					if (itemIdsToLock.has(item.id)) {
						item.metadata.isLocked = true;
					}
				}
				break;
			case ActionType.SetArrangement:
				this.canvasItems = action.data.canvasItems;
				break;
			case ActionType.UnlockCanvasItems:
				const itemIdsToUnlock = new Set(action.data.canvasItems.map((x) => x.id));
				for (let i = 0; i < this.canvasItems.length; i++) {
					const item = this.canvasItems[i];

					if (itemIdsToUnlock.has(item.id)) {
						item.metadata.isLocked = false;
					}
				}
				break;
			default:
				break;
		}

		this.handleCanvasItemsChange();
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

		this.canvasItems.forEach(({ canvasItem }) => {
			const context = this.generateCanvasContextForItem(canvasItem);
			canvasItem.render(this.painter, context);
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
		isBeingSerialized: false,
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

	private addCanvasItem = (canvasItem: ICanvasItem): void => {
		const instance = {
			canvasItem,
			metadata: {},
			id: this.getNextCanvasItemInstanceId(),
		};

		this.canvasItems.push(instance);
		this.actionHistoryManager.recordAddCanvasItems([ instance ]);
		this.handleCanvasItemsChange();
	};

	private handleCanvasItemsChange = (): void => {
		if (this._onCanvasItemChange) {
			const data = this.canvasItems.map(generateRenderable);
			this._onCanvasItemChange(data);
		}

		if (this.selectionManager.selectedItems.some((item) => !this.canvasItems.find((x) => x.canvasItem === item))) {
			this.selectionManager.deselectItems();
		}
	};

	private getNextCanvasItemInstanceId = (): number => ++this.nextCanvasItemInstanceId;
}
