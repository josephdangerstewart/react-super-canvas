import ISelection from '../../types/ISelection';
import ICanvasItem from '../../types/ICanvasItem';
import Context from '../../types/context/Context';
import { pointInsideRect } from '../../utility/shapes-util';
import CanvasInteractionManager from './CanvasInteractionManager';
import { CanvasItemInstance } from '../../types/utility/CanvasItemInstance';

type OnSelectionChangeCallback = () => void;

/**
 * This class exists to abstract selection logic from the SuperCanvasManager
 * making it easy for it to manage which canvas items are selected
 */
export default class SelectionManager implements ISelection {
	private onSelectionChangeHandlers: OnSelectionChangeCallback[];
	private _selectedItems: CanvasItemInstance[];
	private _mouseDragged: boolean;
	private interactionManager: CanvasInteractionManager;

	constructor(interactionManager: CanvasInteractionManager) {
		this._selectedItems = [];
		this._mouseDragged = false;
		this.onSelectionChangeHandlers = [];
		this.interactionManager = interactionManager;
	}

	/* INTERFACE METHODS */

	get selectedItem(): ICanvasItem {
		return this._selectedItems[0]?.canvasItem;
	}

	get selectedItems(): ICanvasItem[] {
		return this._selectedItems.map(({ canvasItem }) => canvasItem);
	}

	get selectedItemCount(): number {
		return this._selectedItems.length;
	}

	get canMove(): boolean {
		return this._selectedItems.length && this._selectedItems.every(({ canvasItem, metadata }) => !metadata.isLocked && canvasItem.applyMove);
	}

	get canScale(): boolean {
		return this._selectedItems.length && this._selectedItems.every(({ canvasItem, metadata }) => !metadata.isLocked && canvasItem.applyScale);
	}

	get canRotate(): boolean {
		return this._selectedItems.length === 1 && Boolean(this._selectedItems[0].canvasItem.applyRotation) && !this._selectedItems[0].metadata.isLocked;
	}

	/* PUBLIC METHODS */

	isSelected = (item: CanvasItemInstance): boolean => this._selectedItems.includes(item);

	onSelectionChange = (callback: OnSelectionChangeCallback): void => {
		this.onSelectionChangeHandlers.push(callback);
	};

	getSelectedInstances = (): CanvasItemInstance[] => this._selectedItems;

	mouseDown = (): void => {
		this._mouseDragged = false;
	};

	mouseDragged = (): void => {
		this._mouseDragged = true;
	};

	mouseUp = (context: Context, canvasItems: CanvasItemInstance[]): void => {
		if (this._mouseDragged) {
			return;
		}

		const { mousePosition } = context;

		// All the canvas items that hit the point
		const hits: CanvasItemInstance[] = [];

		// Reverse iterate over the canvas items because the last hit in the array
		// should be the one that hits
		for (let i = canvasItems.length - 1; i >= 0; i--) {
			const { canvasItem, metadata } = canvasItems[i];
			const isLocked = metadata.isLocked && !this.interactionManager.keysDown.Alt;

			// If the canvas item supplies a pointInsideItem method then use only that to determine if the
			// point hits the canvas item, otherwise check inside the bounding rectangle
			if (
				!isLocked
				&& (
					(canvasItem.pointInsideItem && canvasItem.pointInsideItem(mousePosition))
					|| (!canvasItem.pointInsideItem && pointInsideRect(mousePosition, canvasItem.getBoundingRect()))
				)
			) {
				hits.push(canvasItems[i]);
			}
		}

		const selectedIndex = hits.findIndex(({ canvasItem }) => canvasItem === this.selectedItem);

		if (selectedIndex === hits.length - 1) {
			// The user is already selecting the bottom item in the stack so deselect
			this.deselectItems();
		} else if (this.interactionManager.keysDown.Control) {
			this.addSelectedItem(hits[selectedIndex + 1]);
		} else {
			// Select the next item in the hit stack
			this.setSelectedItem(hits[selectedIndex + 1]);
		}
	};

	deselectItems = (): void => {
		this._selectedItems = [];
		this.onSelectionChangeHandlers.forEach((handler): void => handler());
	};

	setSelectedItems = (items: CanvasItemInstance[]): void => {
		this._selectedItems = items;
		this.onSelectionChangeHandlers.forEach((handler): void => handler());
	};

	/* PRIVATE METHODS */

	private setSelectedItem = (item: CanvasItemInstance): void => {
		this._selectedItems = [ item ];
		this.onSelectionChangeHandlers.forEach((handler): void => handler());
	};

	private addSelectedItem = (item: CanvasItemInstance): void => {
		this._selectedItems.push(item);
		this.onSelectionChangeHandlers.forEach((handler): void => handler());
	};
}
