import ICanvasItem from './ICanvasItem';
import IBackgroundElement from './IBackgroundElement';
import IBrush from './IBrush';

export default interface ISuperCanvasManager {
	/**
	 * @description Initializes the super canvas manager with the canvas element
	 */
	init: (canvas: HTMLCanvasElement) => void;

	/**
	 * @description Sets the active canvas items (useful for a controlled version of the editor)
	 */
	setCanvasItems: (items: ICanvasItem[]) => void;

	/**
	 * @description Gets all the active canvas items (useful for external saving)
	 */
	getCanvasItems: () => ICanvasItem[];

	/**
	 * @description Sets the active background element. Does not have a getter because it cannot be
	 * mutated internally
	 */
	setActiveBackgroundElement: (element: IBackgroundElement) => void;

	/**
	 * @description Sets the available brushes that the end user can use. Does not have a getter because
	 * it cannot be mutated internally
	 */
	setAvailableBrushes: (brushes: IBrush[]) => void;
}
