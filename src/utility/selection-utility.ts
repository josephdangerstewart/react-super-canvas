import ISelection from '../types/ISelection';
import ICanvasItem from '../types/ICanvasItem';

/**
 * @description Returns a selection object of a collection of canvas items
 */
export function createSelection(canvasItems: ICanvasItem[]): ISelection {
	return {
		canMove: canvasItems && canvasItems.every((item) => item.applyMove),
		canScale: canvasItems && canvasItems.every((item) => item.applyScale),
		canRotate: canvasItems && canvasItems.length === 0 && Boolean(canvasItems[0].applyRotation),
		selectedItemCount: canvasItems && canvasItems.length,
		selectedItem: canvasItems && canvasItems[0],
		selectedItems: canvasItems,
	};
}
