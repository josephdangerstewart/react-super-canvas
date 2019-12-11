import Context from '../../types/context/Context';
import IPainterAPI from '../../types/IPainterAPI';
import ISelection from '../../types/ISelection';
import Rectangle from '../../types/shapes/Rectangle';
import StyledShape from '../../types/shapes/StyledShape';
import { vector, pointInsideRect } from '../../utility/shapes-util';

const HANDLE_RADIUS = 4;

const boundingRectangleStyles: StyledShape = {
	fillColor: null,
	strokeColor: '#8BDCF4',
	strokeWeight: null,
	fillImageUrl: null,
};

const handleStyles: StyledShape = {
	fillColor: '#7FC8DE',
	strokeColor: '#7FC8DE',
	strokeWeight: null,
	fillImageUrl: null,
};

/**
 * This class exists to abstract the canvas item transform logic away from the SuperCanvasManager
 */
export class TransformManager {
	private selectionManager: ISelection;

	constructor(selectionManager: ISelection) {
		this.selectionManager = selectionManager;
	}

	render = (painter: IPainterAPI, context: Context): void => {
		const canvasItem = this.selectionManager.selectedItem;

		if (!canvasItem) {
			return;
		}

		const boundingRect = canvasItem.getBoundingRect();

		this.renderBoundingRectangle(painter, boundingRect);

		if (canvasItem.onScale) {
			this.renderScaleHandles(painter, boundingRect, context);
		}
	};

	private renderBoundingRectangle = (painter: IPainterAPI, rect: Rectangle): void => {
		painter.drawRect({
			...rect,
			...boundingRectangleStyles,
		});
	};

	private renderScaleHandles = (painter: IPainterAPI, rect: Rectangle, context: Context): void => {
		const { x, y } = rect.topLeftCorner;
		const { width, height } = rect;

		painter.drawRect(this.scaleHandle(x, y, context));
		painter.drawRect(this.scaleHandle(x, y + height, context));
		painter.drawRect(this.scaleHandle(x + width, y + height, context));
		painter.drawRect(this.scaleHandle(x + width, y, context));
	};

	private scaleHandle = (x: number, y: number, context: Context): Rectangle => {
		const { mousePosition } = context;
		const rect = {
			topLeftCorner: vector(x - HANDLE_RADIUS / 2, y - HANDLE_RADIUS / 2),
			width: HANDLE_RADIUS,
			height: HANDLE_RADIUS,
		};

		const styles = {
			...handleStyles,
		};

		if (pointInsideRect(mousePosition, rect)) {
			styles.fillColor = '#72B5C8';
		}

		return {
			...rect,
			...styles,
		};
	};
}
