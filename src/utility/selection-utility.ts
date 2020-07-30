import ISelection from '../types/ISelection';
import { CanvasItemInstance } from '../types/utility/CanvasItemInstance';

/**
 * @description Returns a selection object of a collection of canvas items
 */
export function createSelection(canvasItems: CanvasItemInstance[]): ISelection {
	return {
		canMove: canvasItems && canvasItems.every(({ canvasItem, metadata }) => !metadata.isLocked && canvasItem.applyMove),
		canScale: canvasItems && canvasItems.every(({ canvasItem, metadata }) => !metadata.isLocked && canvasItem.applyScale),
		canRotate: canvasItems && canvasItems.length === 1 && Boolean(canvasItems[0].canvasItem.applyRotation) && !canvasItems[0].metadata.isLocked,
		selectedItemCount: canvasItems && canvasItems.length,
		selectedItem: canvasItems && canvasItems[0].canvasItem,
		selectedItems: canvasItems.map(({ canvasItem }) => canvasItem),
	};
}
