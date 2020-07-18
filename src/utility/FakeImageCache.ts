import { IImageCache } from '../types/IImageCache';

export class FakeImageCache implements IImageCache {
	withCachedImage = (): boolean => false;
	getImageAsync = (): Promise<HTMLImageElement> => Promise.resolve(null);
	getImage = (): HTMLImageElement => null;
	clearCache = (): void => null;
}
