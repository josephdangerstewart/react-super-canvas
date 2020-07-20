import ICanvasItem from './ICanvasItem';

export default interface ISelection {
	/**
	 * @description The item that is currently selected by the user or the first item
	 * selected in the case of multi selection. Will be `null` if no item is selected
	 */
	selectedItem: ICanvasItem;

	/**
	 * @description All items that are selected by the user in the order that they were
	 * selected
	 */
	selectedItems: ICanvasItem[];

	/**
	 * @description The number of items that are selected
	 */
	selectedItemCount: number;

	/**
	 * @description Whether or not the scale operation can be performed on this selection
	 */
	canScale: boolean;

	/**
	 * @description Whether or not the move operation can be performed on this selection
	 */
	canMove: boolean;

	/**
	 * @description Whether or not the rotate operation can be performed on this selection
	 */
	canRotate: boolean;
}
