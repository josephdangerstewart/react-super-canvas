import Context from './Context';

export default interface CanvasItemContext extends Context {
	/**
	 * @description Whether or not the current item is selected
	 */
	isSelected: boolean;
}
