import Context from '../../types/context/Context';
import IPainterAPI from '../../types/IPainterAPI';
import ISelection from '../../types/ISelection';
import Rectangle from '../../types/shapes/Rectangle';
import StyledShape from '../../types/shapes/StyledShape';
import { vector, pointInsideRect, pointInsideCircle } from '../../utility/shapes-util';
import { ScalingNode } from '../../types/transform/ScalingNode';
import Circle from '../../types/shapes/Circle';
import Line from '../../types/shapes/Line';
import { TransformKind } from '../../types/transform/TransformKind';
import { TransformOperation } from '../../types/transform/TransformOperation';

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
	private isMouseDown: boolean;

	private transformOperation: TransformOperation;
	private selectedItemBoundingRect: Rectangle;
	private previewRect: Rectangle;

	constructor(selectionManager: ISelection) {
		this.selectionManager = selectionManager;
	}

	render = (painter: IPainterAPI, context: Context): void => {
		const canvasItem = this.selectionManager.selectedItem;

		if (!canvasItem || !canvasItem.applyTransform) {
			return;
		}

		const boundingRect = this.previewRect || canvasItem.getBoundingRect();
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

		if (!canvasItem) {
			return;
		}

		const boundingRect = canvasItem.getBoundingRect();
		this.selectedItemBoundingRect = boundingRect;
		this.previewRect = boundingRect;
		const scaleNode = this.getScaleNodes(boundingRect).find(({ node }) => pointInsideRect(mousePosition, node));

		if (scaleNode) {
			this.transformOperation = {
				action: TransformKind.Scale,
				scale: {
					value: vector(1, 1),
					node: scaleNode.type,
				},
			};

			return;
		}

		const [ rotateHandle ] = this.getRotateHandle(boundingRect);
		if (pointInsideCircle(mousePosition, rotateHandle)) {
			this.transformOperation = {
				action: TransformKind.Rotate,
				rotation: 0,
			};

			return;
		}

		if (pointInsideRect(mousePosition, boundingRect)) {
			this.transformOperation = {
				action: TransformKind.Move,
				move: vector(0, 0),
			};
		}
	};

	mouseDragged = (context: Context): void => {
		if (!this.isMouseDown) {
			return;
		}

		const { action } = this.transformOperation || { action: null };

		const { x: curX, y: curY } = context.mousePosition;
		const { width, height } = this.selectedItemBoundingRect;
		const { x: left, y: top } = this.selectedItemBoundingRect.topLeftCorner;
		const right = left + width;
		const bottom = top + height;

		if (action === TransformKind.Scale) {
			const { node } = this.transformOperation.scale;

			let newTopLeft = vector(left, top);
			let delta = vector(0, 0);
			console.log(node);
			switch (node) {
				case ScalingNode.TopLeft:
					delta = vector(left - curX, top - curY);
					newTopLeft = vector(curX, curY);
					break;
				case ScalingNode.TopRight:
					delta = vector(curX - right, top - curY);
					newTopLeft = vector(left, curY);
					break;
				case ScalingNode.BottomLeft:
					delta = vector(left - curX, curY - bottom);
					newTopLeft = vector(curX, top);
					break;
				case ScalingNode.BottomRight:
					delta = vector(curX - right, curY - bottom);
					newTopLeft = vector(left, top);
					break;
				default:
					break;
			}

			this.previewRect = {
				topLeftCorner: newTopLeft,
				width: width + delta.x,
				height: height + delta.y,
			};

			console.log(delta, this.previewRect);

			this.transformOperation.scale.value = vector((width + delta.x) / width, (height + delta.y) / height);
		} else if (action === TransformKind.Rotate) {
			console.log('Rotating');
		} else if (action === TransformKind.Move) {
			console.log('Moving');
		}
	};

	mouseUp = (): void => {
		this.isMouseDown = false;
		this.transformOperation = null;
		this.previewRect = null;
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
				type: ScalingNode.TopRight,
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
				node: this.scaleHandle(x + width, y + height, context),
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
