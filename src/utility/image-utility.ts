import Vector2D from '../types/utility/Vector2D';
import { IImageCache } from '../types/IImageCache';
import Rectangle from '../types/shapes/Rectangle';

export function boundingRectOfImage(imageUrl: string, scale: Vector2D, topLeftCorner: Vector2D, imageCache: IImageCache): Rectangle {
	const image = imageCache.getImage(imageUrl);

	if (!image) {
		return null;
	}

	const { width, height } = image.getBoundingClientRect();

	return {
		topLeftCorner,
		width: width * scale.x,
		height: height * scale.y,
	};
}
