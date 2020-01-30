import { IImageCache } from '../types/IImageCache';
import CachedImage from '../types/utility/CachedImage';
import { WithCachedImageCallback, OnImageUnprocessedCallback } from '../types/callbacks/WithCachedImageCallback';

export default class ImageCache implements IImageCache {
	private imageCache: Record<string, CachedImage>;
	private returnImageAsyncCallbackStack: Record<string, ((image: HTMLImageElement) => void)[]>;
	private context2d: CanvasRenderingContext2D;

	constructor(context: CanvasRenderingContext2D) {
		this.context2d = context;
		this.returnImageAsyncCallbackStack = {};
		this.imageCache = {};
	}

	getImageAsync = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
		const cachedImage = this.imageCache[src];
		const image = cachedImage ? cachedImage.image : new Image();

		if (cachedImage && cachedImage.isBroken) {
			reject(new Error('broken image'));
			return;
		}

		if (!this.returnImageAsyncCallbackStack[src]) {
			this.returnImageAsyncCallbackStack[src] = [];
		}

		if (!cachedImage) {
			this.imageCache[src] = {
				image,
				lastAccessed: new Date(),
				repeating: null,
				isBroken: false,
			};
		} else {
			this.imageCache[src].lastAccessed = new Date();
		}

		if (!image.complete) {
			this.returnImageAsyncCallbackStack[src].push(resolve);
			image.onload = (): void => {
				this.handleOnImageLoad(src);
			};

			image.onerror = (): void => {
				reject(new Error('broken image'));
			};
		} else {
			resolve(image);
		}
	});

	withCachedImage = (src: string, callback: WithCachedImageCallback, onImageUnprocessed?: OnImageUnprocessedCallback): boolean => {
		const cachedImage = this.imageCache[src];
		const image = cachedImage ? cachedImage.image : new Image();

		if (cachedImage && cachedImage.isBroken) {
			return false;
		}

		if (!cachedImage) {
			image.src = src;
		}

		if (!image.complete) {
			// Do not handle context sensitive code asynchronously
			// we don't want consumers drawing the canvas whenever their image happens to load
			// So don't call the callback in onload
			image.onload = (): void => {
				this.handleOnImageLoad(src);
			};

			image.onerror = (): void => {
				this.handleOnImageError(src);
			};

			if (onImageUnprocessed) {
				onImageUnprocessed();
			}
		} else {
			callback(image, cachedImage && cachedImage.repeating);
		}

		// Still cache the image though no matter what
		if (!cachedImage) {
			this.imageCache[src] = {
				image,
				lastAccessed: new Date(),
				repeating: null,
				isBroken: false,
			};
		} else {
			this.imageCache[src].lastAccessed = new Date();
		}

		return image.complete;
	};

	clearCache = (timeout: number): void => {
		const now = new Date();
		Object.keys(this.imageCache).forEach((key) => {
			if (+now - +this.imageCache[key].lastAccessed > timeout) {
				this.imageCache[key] = null;
			}
		});
	};

	private handleOnImageError = (src: string): void => {
		const cachedImage = this.imageCache[src];

		if (!cachedImage) {
			return;
		}

		cachedImage.isBroken = true;
	};

	private handleOnImageLoad = (src: string): void => {
		const cachedImage = this.imageCache[src];

		if (!cachedImage) {
			return;
		}

		cachedImage.repeating = this.context2d.createPattern(cachedImage.image, 'repeat');

		const callStack = this.returnImageAsyncCallbackStack[src];

		if (callStack) {
			callStack.forEach((callback) => callback(cachedImage.image));
		}

		this.returnImageAsyncCallbackStack[src] = null;
	};
}
