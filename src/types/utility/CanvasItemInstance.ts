import ICanvasItem from '../ICanvasItem';

/**
 * @description This interface adds a wrapper around ICanvas item so
 * the super canvas manager can add it's own metadata to it
 */
export default interface CanvasItemInstance extends ICanvasItem {
	$rotation: number;
}
