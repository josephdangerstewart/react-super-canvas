import { WithCachedImageCallback, OnImageUnprocessedCallback } from './callbacks/WithCachedImageCallback';

export interface IImageCache {
	/**
	 * @description Gets an image from the cache
	 */
	withCachedImage: (imageUrl: string, callback: WithCachedImageCallback, onImageUnprocessed?: OnImageUnprocessedCallback) => boolean;

	/**
	 * @description Gets an image from the cache asynchronously. Will timeout if cannot retrieve image
	 */
	getImageAsync: (imageUrl: string) => Promise<HTMLImageElement>;

	/**
	 * @description Gets an image synchronously, will return null until the image is loaded.
	 */
	getImage: (imageUrl: string) => HTMLImageElement;

	/**
	 * @description Clears the image cache of images that haven't been used in at least *timeout* milliseconds
	 */
	clearCache: (timeout: number) => void;
}
