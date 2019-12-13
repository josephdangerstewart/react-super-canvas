import Context from '../../types/context/Context';
import IPainterAPI from '../../types/IPainterAPI';
import ISelection from '../../types/ISelection';
import Rectangle from '../../types/shapes/Rectangle';
import StyledShape from '../../types/shapes/StyledShape';
import { vector, pointInsideRect } from '../../utility/shapes-util';
import { ScalingNode } from '../../types/utility/ScalingNode';

const HANDLE_RADIUS = 6;

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

enum Action {
	Scale,
	Rotate,
	Move,
}

/**
 * This class exists to abstract the canvas item transform logic away from the SuperCanvasManager
 */
export class TransformManager {
	private selectionManager: ISelection;
	private dragAction: Action;
	private scalingNode: ScalingNode;
	private isMouseDown: boolean;

	constructor(selectionManager: ISelection) {
		this.selectionManager = selectionManager;
	}

	render = (painter: IPainterAPI, context: Context): void => {
		const canvasItem = this.selectionManager.selectedItem;

		if (!canvasItem) {
			return;
		}

		const boundingRect = canvasItem.getBoundingRect();

		painter.drawRect({
			...boundingRect,
			...boundingRectangleStyles,
		});

		this.getScaleNodes(boundingRect, context).map(({ node }) => node).forEach(painter.drawRect);
	};

	mouseDown = (context: Context): void => {
		this.isMouseDown = true;
		const canvasItem = this.selectionManager.selectedItem;
		const { mousePosition } = context;

		if (!canvasItem) {
			return;
		}

		const boundingRect = canvasItem.getBoundingRect();
		const scaleNode = this.getScaleNodes(boundingRect).find(({ node }) => pointInsideRect(mousePosition, node));

		if (scaleNode) {
			this.scalingNode = scaleNode.type;
			this.dragAction = Action.Scale;
			return;
		}

		if (pointInsideRect(mousePosition, boundingRect)) {
			this.dragAction = Action.Move;
		}
	};

	mouseDragged = (): void => {
		if (!this.isMouseDown) {
			return;
		}

		if (this.dragAction === Action.Scale) {
			console.log(`Scaling on ${this.scalingNode}`);
		}
	};

	mouseUp = (): void => {
		this.isMouseDown = false;
		this.dragAction = null;
		this.scalingNode = null;
	};

	private getScaleNodes = (rect: Rectangle, context?: Context): { type: ScalingNode; node: Rectangle }[] => {
		const { x, y } = rect.topLeftCorner;
		const { width, height } = rect;
		const halfWidth = Math.floor(width / 2);
		const halfHeight = Math.floor(height / 2);

		return [
			{
				type: ScalingNode.TopLeft,
				node: this.scaleHandle(x, y, context),
			},
			{
				type: ScalingNode.TopMiddle,
				node: this.scaleHandle(x + halfWidth, y, context),
			},
			{
				type: ScalingNode.TopLeft,
				node: this.scaleHandle(x + width, y, context),
			},
			{
				type: ScalingNode.MiddleLeft,
				node: this.scaleHandle(x, y + halfHeight, context),
			},
			{
				type: ScalingNode.MiddleRight,
				node: this.scaleHandle(x + width, y + halfHeight, context),
			},
			{
				type: ScalingNode.BottomLeft,
				node: this.scaleHandle(x, y + height, context),
			},
			{
				type: ScalingNode.BottomMiddle,
				node: this.scaleHandle(x + halfWidth, y + height, context),
			},
			{
				type: ScalingNode.BottomRight,
				node: this.scaleHandle(x + width, y + width, context),
			},
		];
	};

	private scaleHandle = (x: number, y: number, context?: Context): Rectangle => {
		const { mousePosition } = context || { mousePosition: null };
		const rect = {
			topLeftCorner: vector(x - HANDLE_RADIUS / 2, y - HANDLE_RADIUS / 2),
			width: HANDLE_RADIUS,
			height: HANDLE_RADIUS,
		};

		const styles = {
			...handleStyles,
		};

		if (mousePosition && pointInsideRect(mousePosition, rect)) {
			styles.fillColor = '#72B5C8';
		}

		return {
			...rect,
			...styles,
		};
	};
}
