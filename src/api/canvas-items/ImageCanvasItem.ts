import ICanvasItem from '../../types/ICanvasItem';
import Rectangle from '../../types/shapes/Rectangle';
import { vector } from '../../utility/shapes-util';
import Vector2D from '../../types/utility/Vector2D';
import IPainterAPI from '../../types/IPainterAPI';
import { IImageCache } from '../../types/IImageCache';
import { ScalingNode } from '../../types/transform/ScalingNode';
import { scaleRectangle } from '../../utility/transform-utility';
import JsonData from '../../types/utility/JsonData';

export default class ImageCanvasItem implements ICanvasItem {
	private src: string;
	private topLeftCorner: Vector2D;
	private scale: Vector2D;
	private size: Vector2D;
	private imageCache: IImageCache;

	constructor(src?: string, topLeftCorner?: Vector2D, imageCache?: IImageCache) {
		if (!src && !topLeftCorner && !imageCache) {
			return;
		}

		this.src = src;
		this.topLeftCorner = topLeftCorner;
		this.scale = vector(1, 1);
		this.size = vector(0, 0);
		this.imageCache = imageCache;

		this.generateSize();
	}

	toJson = (): JsonData => ({
		src: this.src,
		topLeftCorner: this.topLeftCorner,
		scale: this.scale,
		size: this.size,
	});

	fromJson = (data: JsonData): void => {
		const {
			src,
			topLeftCorner,
			scale,
			size,
		} = data;

		if (src) {
			this.src = src as string;
		}

		if (topLeftCorner) {
			this.topLeftCorner = topLeftCorner as Vector2D;
		}

		if (scale) {
			this.scale = scale as Vector2D;
		}

		if (size) {
			this.size = size as Vector2D;
		}
	};

	render = (painter: IPainterAPI): void => {
		painter.drawImage(this.topLeftCorner, this.src, this.scale);
	};

	getBoundingRect = (): Rectangle => ({
		topLeftCorner: this.topLeftCorner,
		width: this.size.x * this.scale.x,
		height: this.size.y * this.scale.y,
	});

	applyMove = (move: Vector2D): void => {
		this.topLeftCorner.x += move.x;
		this.topLeftCorner.y += move.y;
	};

	applyScale = (scale: Vector2D, node: ScalingNode): void => {
		const scaledRect = scaleRectangle(this.getBoundingRect(), scale, node);
		this.topLeftCorner = scaledRect.topLeftCorner;
		this.scale.x *= scale.x;
		this.scale.y *= scale.y;
	};

	private generateSize = async (): Promise<void> => {
		const image = await this.imageCache.getImageAsync(this.src);
		this.size = vector(image.width, image.height);
	};
}
