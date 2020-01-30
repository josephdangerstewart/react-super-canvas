export default interface CachedImage {
	image: HTMLImageElement;
	lastAccessed: Date;
	repeating: CanvasPattern;
	isBroken: boolean;
}
