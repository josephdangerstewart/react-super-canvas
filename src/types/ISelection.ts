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
}
