import ICanvasItem from './ICanvasItem';
import IBackgroundElement from './IBackgroundElement';
import IBrush from './IBrush';
import StyleContext from './context/StyleContext';
import { ActiveBrushChangeCallback } from './callbacks/ActiveBrushChangeCallback';
import { StyleContextChangeCallback } from './callbacks/StyleContextChangeCallback';
import { OnCanvasItemChangeCallback } from './callbacks/OnCanvasItemChangeCallback';
import { OnSelectionChangeCallback } from './callbacks/OnSelectionChangeCallback';
import JsonData from './utility/JsonData';
import ISelection from './ISelection';
import { Renderable } from './Renderable';

export default interface ISuperCanvasManager {
	/**
	 * @description Initializes the super canvas manager with the canvas element and begins the update loop
	 */
	init: (canvas: HTMLCanvasElement) => void;

	/**
	 * @description Stops the update loop and cleans up the canvas
	 */
	destroy: () => void;

	/**
	 * @description Sets the active canvas items (useful for a controlled version of the editor)
	 */
	setCanvasItems: (items: JsonData[]) => void;

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

	/**
	 * @description Sets the brush that is currently being used
	 */
	setActiveBrushByName: (brushName: string) => void;

	/**
	 * @description Sets the brush that the user is currently using
	 */
	setActiveBrush: (brush: IBrush) => void;

	/**
	 * @description Sets the style context for the active brush
	 */
	setStyleContext: (styleContext: StyleContext) => void;

	/**
	 * @description Calls the callback when the brush is changed
	 */
	onActiveBrushChange: (onChange: ActiveBrushChangeCallback) => void;

	/**
	 * @description Calls the callback when the style context is changed
	 */
	onStyleContextChange: (onChange: StyleContextChangeCallback) => void;

	/**
	 * @description A callback for when the canvas items change
	 */
	onCanvasItemsChange: (onChange: OnCanvasItemChangeCallback) => void;

	/**
	 * @description Clears the super canvas
	 */
	clear: () => void;

	/**
	 * @description Attatches a listener for when the selection changes
	 */
	onSelectionChange: (onChange: OnSelectionChangeCallback) => void;

	/**
	 * @description Deletes selected canvas item or does nothing if no
	 * item is selected
	 */
	deleteSelectedCanvasItem: () => void;

	/**
	 * @description Gets the current selection
	 */
	getSelection: () => ISelection;

	/**
	 * @description Undos the last action
	 */
	undo: () => void;

	/**
	 * @description Redos the last action
	 */
	redo: () => void;

	/**
	 * @description Converts an array of renderables into an array of canvas items
	 */
	fromRenderables: (renderables: Renderable[]) => ICanvasItem[];

	/**
	 * @description Adds canvas items and invokes onChange
	 */
	addCanvasItems: (canvasItems: ICanvasItem[]) => void;

	/**
	 * @description Serializes the current selection to an array of Renderables
	 */
	serializeCurrentSelection: () => Renderable[];

	/**
	 * @description Locks current selection
	 */
	lockCurrentSelection: () => void;

	/**
	 * @description Unlock current selection
	 */
	unlockCurrentSelection: () => void;
}
