import ICanvasItem from '../ICanvasItem';
import TransformContext from '../context/TransformContext';

/**
 * @description This interface adds a wrapper around ICanvas item so
 * the super canvas manager can add it's own metadata to it
 */
export default interface CanvasItemInstance extends ICanvasItem {
	$transform: TransformContext;
}
