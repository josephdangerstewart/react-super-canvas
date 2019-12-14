import Context from '../../types/context/Context';
import IPainterAPI from '../../types/IPainterAPI';
import ISelection from '../../types/ISelection';
import Rectangle from '../../types/shapes/Rectangle';
import StyledShape from '../../types/shapes/StyledShape';
import { vector, pointInsideRect, pointInsideCircle } from '../../utility/shapes-util';
import { ScalingNode } from '../../types/transform/ScalingNode';
import Circle from '../../types/shapes/Circle';
import Line from '../../types/shapes/Line';
import Vector2D from '../../types/utility/Vector2D';
import { TransformKind } from '../../types/transform/TransformKind';

const HANDLE_DIAMETER = 12;
const ROTATE_HANDLE_HEIGHT = 20;

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

const handleStylesHovered: StyledShape = {
	...handleStyles,
	fillColor: '#72B5C8',
};

/**
 * This class exists to abstract the canvas item transform logic away from the SuperCanvasManager
 */
export class TransformManager {
	private selectionManager: ISelection;
	private dragTransformKind: TransformKind;
	private scalingNode: ScalingNode;
	private isMouseDown: boolean;

	private mouseDownPosition: Vector2D;
	private selectedItemBoundingRect: Rectangle;

	constructor(selectionManager: ISelection) {
		this.selectionManager = selectionManager;
		this.mouseDownPosition = vector(0, 0);
	}

	render = (painter: IPainterAPI, context: Context): void => {
		const canvasItem = this.selectionManager.selectedItem;

		if (!canvasItem) {
			return;
		}

		const boundingRect = canvasItem.getBoundingRect();
		const [ rotateHandle, rotateHandleLine ] = this.getRotateHandle(boundingRect, context);

		painter.drawLine({
			...rotateHandleLine,
			...boundingRectangleStyles,
		});

		painter.drawRect({
			...boundingRect,
			...boundingRectangleStyles,
		});

		this.getScaleNodes(boundingRect, context).map(({ node }) => node).forEach(painter.drawRect);

		painter.drawCircle(rotateHandle);
	};

	mouseDown = (context: Context): void => {
		this.isMouseDown = true;
		const canvasItem = this.selectionManager.selectedItem;
		const { mousePosition } = context;

		this.mouseDownPosition = { ...mousePosition };

		if (!canvasItem) {
			return;
		}

		const boundingRect = canvasItem.getBoundingRect();
		this.selectedItemBoundingRect = boundingRect;
		const scaleNode = this.getScaleNodes(boundingRect).find(({ node }) => pointInsideRect(mousePosition, node));

		if (scaleNode) {
			this.scalingNode = scaleNode.type;
			this.dragTransformKind = TransformKind.Scale;
			return;
		}

		const [ rotateHandle ] = this.getRotateHandle(boundingRect);
		if (pointInsideCircle(mousePosition, rotateHandle)) {
			this.dragTransformKind = TransformKind.Rotate;
			return;
		}

		if (pointInsideRect(mousePosition, boundingRect)) {
			this.dragTransformKind = TransformKind.Move;
		}
	};

	mouseDragged = (context: Context): void => {
		if (!this.isMouseDown) {
			return;
		}

		if (this.dragTransformKind === TransformKind.Scale) {
			console.log('Scaling');
		} else if (this.dragTransformKind === TransformKind.Rotate) {
			console.log('Rotating');
		} else if (this.dragTransformKind === TransformKind.Move) {
			console.log('Moving');
		}
	};

	mouseUp = (): void => {
		this.isMouseDown = false;
		this.dragTransformKind = null;
		this.scalingNode = null;
	};

	private getRotateHandle = (rect: Rectangle, context?: Context): [Circle, Line] => {
		const { x, y } = rect.topLeftCorner;
		const { width } = rect;
		const { mousePosition } = context || { mousePosition: null };
		const halfWidth = Math.floor(width / 2);

		const point1 = vector(x + halfWidth, y);
		const point2 = vector(x + halfWidth, y - ROTATE_HANDLE_HEIGHT);

		const circle: Circle = {
			center: vector(x + halfWidth, y - ROTATE_HANDLE_HEIGHT - HANDLE_DIAMETER / 2),
			radius: HANDLE_DIAMETER / 2,
		};

		const styles = mousePosition && pointInsideCircle(mousePosition, circle) ? handleStylesHovered : handleStyles;

		return [
			{ ...circle, ...styles },
			{ point1, point2 },
		];
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
			topLeftCorner: vector(x - HANDLE_DIAMETER / 2, y - HANDLE_DIAMETER / 2),
			width: HANDLE_DIAMETER,
			height: HANDLE_DIAMETER,
		};

		let styles = handleStyles;

		if (mousePosition && pointInsideRect(mousePosition, rect)) {
			styles = handleStylesHovered;
		}

		return {
			...rect,
			...styles,
		};
	};
}
