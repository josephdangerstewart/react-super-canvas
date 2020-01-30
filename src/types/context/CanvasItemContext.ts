import Context from './Context';
import { IImageCache } from '../IImageCache';

export default interface CanvasItemContext extends Context {
	/**
	 * @description Whether or not the current item is selected
	 */
	isSelected: boolean;

	/**
	 * @description The image cache for the component
	 */
	imageCache: IImageCache;
}
