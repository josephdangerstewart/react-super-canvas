import { Renderable } from '../types/Renderable';
import CanvasItemContext from '../types/context/CanvasItemContext';
import { vector } from './shapes-util';
import { FakeImageCache } from './FakeImageCache';
import { RenderableSnapshotPainter } from './RenderableSnapshotPainter';
import { CanvasItemInstance } from '../types/utility/CanvasItemInstance';

export function generateRenderable(instance: CanvasItemInstance): Renderable {
	const { canvasItem, metadata } = instance;
	const canvasItemJson = canvasItem.toJson ? {
		item: canvasItem.toJson(),
		canvasItemName: canvasItem.canvasItemName,
	} : null;

	const painter = new RenderableSnapshotPainter();
	const imageCache = new FakeImageCache();
	const fakeContext: CanvasItemContext = {
		isPanning: false,
		isSelected: false,
		imageCache,
		mousePosition: vector(Infinity, Infinity),
		absoluteMousePosition: vector(Infinity, Infinity),
		styleContext: {},
		isBeingSerialized: true,
	};

	canvasItem.render(painter, fakeContext);
	const ops = painter.getRenderOps();

	return {
		ops,
		canvasItemJson,
		metadata,
	};
}
