import IBrush, { DefaultBrushKind } from '../../types/IBrush';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/**
 * @remarks This is a special kind of brush that must always be present, the super canvas
 * manager uses this brush to allow for canvas item interaction (selection, deletion, editing, etc)
 */
export default class SelectionBrush implements IBrush {
	brushName = DefaultBrushKind.Selection;
	supportedCanvasItems = {};

	renderPreview = noop;
	mouseDown = noop;
}
