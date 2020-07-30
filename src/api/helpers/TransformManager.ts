import IPainterAPI from '../../types/IPainterAPI';
import ISelection from '../../types/ISelection';
import Rectangle from '../../types/shapes/Rectangle';
import StyledShape from '../../types/shapes/StyledShape';
import {
	vector,
	pointInsideRect,
	boundingRectOfRects,
	hasRotation,
	rotateRectAroundPoint,
	centerOfRect,
	rectToPoints,
	pointInsidePolygon,
	rotateLineAroundPoint,
	pointInsideCircle,
	angleOfThreePoints,
} from '../../utility/shapes-util';
import { ScalingNode } from '../../types/transform/ScalingNode';
import { TransformKind } from '../../types/transform/TransformKind';
import { TransformOperation } from '../../types/transform/TransformOperation';
import Vector2D from '../../types/utility/Vector2D';
import { BrushContext } from '../../types/context/BrushContext';
import { applyMultiScale } from '../../utility/transform-utility';
import ActionHistoryManager from './ActionHistoryManager';
import Polygon from '../../types/shapes/Polygon';
import Circle from '../../types/shapes/Circle';
import Line from '../../types/shapes/Line';
import { snapAlongIncrement } from '../../utility/math-utility';
import SelectionManager from './SelectionManager';

const HANDLE_DIAMETER = 12;

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

const handleLineStrokeColor = '#7FC8DE';
const handleLineStrokeWeight = null;
const handleLineLength = 30;

/**
 * This class exists to abstract the canvas item transform logic away from the SuperCanvasManager
 */
export class TransformManager {
	private selectionManager: SelectionManager;
	private isMouseDown: boolean;

	private transformOperation: TransformOperation;
	private selectedItemBoundingRect: Rectangle;
	private previewRect: Rectangle;
	private onCanvasItemChange: () => void;

	private mouseDownAt: Vector2D;
	private actionHistoryManager: ActionHistoryManager;

	constructor(selectionManager: SelectionManager, onCanvasItemChange: () => void, actionHistoryManager: ActionHistoryManager) {
		this.selectionManager = selectionManager;
		this.mouseDownAt = vector(0, 0);
		this.onCanvasItemChange = onCanvasItemChange;
		this.actionHistoryManager = actionHistoryManager;
	}

	render = (painter: IPainterAPI, context: BrushContext): void => {
		const canvasItems = this.selectionManager.selectedItems;
		const { mousePosition } = context;

		if (!canvasItems?.length) {
			return;
		}

		const boundingRect = this.previewRect || boundingRectOfRects(canvasItems.map((item) => item.getBoundingRect()));
		const { canMove, canScale, canRotate } = this.selectionManager;
		const isRotating = this.transformOperation?.action === TransformKind.Rotate;

		const previewRect = {
			...boundingRect,
			...boundingRectangleStyles,
		};

		painter.drawRect(previewRect);

		if (canMove && pointInsideRect(mousePosition, boundingRect)) {
			painter.setCursor('move');
		}

		if (canScale && !isRotating) {
			this.getScaleNodes(boundingRect, previewRect.rotation ?? 0, context).forEach((node) => {
				painter.drawPolygon(node.node);

				if (pointInsidePolygon(mousePosition, node.node)) {
					switch (node.type) {
						case ScalingNode.TopLeft:
							painter.setCursor('nw-resize');
							break;
						case ScalingNode.TopMiddle:
							painter.setCursor('n-resize');
							break;
						case ScalingNode.TopRight:
							painter.setCursor('ne-resize');
							break;
						case ScalingNode.MiddleLeft:
							painter.setCursor('w-resize');
							break;
						case ScalingNode.MiddleRight:
							painter.setCursor('e-resize');
							break;
						case ScalingNode.BottomLeft:
							painter.setCursor('sw-resize');
							break;
						case ScalingNode.BottomMiddle:
							painter.setCursor('s-resize');
							break;
						case ScalingNode.BottomRight:
							painter.setCursor('se-resize');
							break;
						default:
							break;
					}
				}
			});
		}

		if (canRotate) {
			const [ line, circle ] = this.rotationHandle(previewRect, previewRect.rotation ?? 0, context);

			if (!isRotating) {
				painter.drawLine(line);
			}
			painter.drawCircle(circle);

			if (this.transformOperation?.action === TransformKind.Rotate) {
				painter.setCursor('grabbing');
			} else if (pointInsideCircle(mousePosition, circle)) {
				painter.setCursor('grab');
			}
		}
	};

	mouseDown = (context: BrushContext): void => {
		this.isMouseDown = true;
		const canvasItems = this.selectionManager.selectedItems;
		const { snappedMousePosition, mousePosition } = context;

		this.mouseDownAt = { ...snappedMousePosition };

		if (!canvasItems?.length) {
			return;
		}

		const { canScale, canMove, canRotate } = this.selectionManager;

		const boundingRect = boundingRectOfRects(canvasItems.map((item) => item.getBoundingRect()));
		this.selectedItemBoundingRect = boundingRect;
		this.previewRect = boundingRect;
		const scaleNode = canScale && this.getScaleNodes(boundingRect, 0).find(({ node }) => pointInsidePolygon(mousePosition, node));

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

		let isRotating = false;
		if (canRotate) {
			const [ , circle ] = this.rotationHandle(boundingRect, 0);
			isRotating = pointInsideCircle(mousePosition, circle);
		}

		if (isRotating) {
			this.transformOperation = {
				action: TransformKind.Rotate,
				rotation: 0,
			};
		}

		if (canMove && pointInsideRect(mousePosition, boundingRect)) {
			this.transformOperation = {
				action: TransformKind.Move,
				move: vector(0, 0),
			};
		}
	};

	mouseDragged = (context: BrushContext): void => {
		if (!this.isMouseDown || !this.selectionManager.selectedItem) {
			return;
		}

		const { action } = this.transformOperation || { action: null };

		const { x: prevX, y: prevY } = this.mouseDownAt;
		const { x: curX, y: curY } = context.snappedMousePosition;
		const { width, height } = this.selectedItemBoundingRect;
		const { x: left, y: top } = this.selectedItemBoundingRect.topLeftCorner;
		const right = left + width;
		const bottom = top + height;

		if (action === TransformKind.Scale) {
			const { node } = this.transformOperation.scale;

			let newTopLeft = vector(left, top);
			let delta = vector(0, 0);

			switch (node) {
				case ScalingNode.TopLeft:
					delta = vector(left - curX, top - curY);
					newTopLeft = vector(curX, curY);
					break;
				case ScalingNode.TopMiddle:
					delta = vector(0, top - curY);
					newTopLeft = vector(left, curY);
					break;
				case ScalingNode.TopRight:
					delta = vector(curX - right, top - curY);
					newTopLeft = vector(left, curY);
					break;
				case ScalingNode.MiddleLeft:
					delta = vector(left - curX, 0);
					newTopLeft = vector(curX, top);
					break;
				case ScalingNode.MiddleRight:
					delta = vector(curX - right, 0);
					newTopLeft = vector(left, top);
					break;
				case ScalingNode.BottomLeft:
					delta = vector(left - curX, curY - bottom);
					newTopLeft = vector(curX, top);
					break;
				case ScalingNode.BottomMiddle:
					delta = vector(0, curY - bottom);
					newTopLeft = vector(left, top);
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

			this.transformOperation.scale.value = vector((width + delta.x) / width, (height + delta.y) / height);
		} else if (action === TransformKind.Move) {
			this.previewRect = {
				topLeftCorner: vector(curX - (prevX - left), curY - (prevY - top)),
				width,
				height,
			};

			this.transformOperation.move = vector(curX - prevX, curY - prevY);
		} else if (action === TransformKind.Rotate) {
			this.previewRect.rotation = 0;
			const center = centerOfRect(this.previewRect);

			const angle = snapAlongIncrement(
				angleOfThreePoints(center, this.mouseDownAt, context.mousePosition),
				15,
			);

			this.previewRect.rotation = angle;
			this.transformOperation.rotation = angle;
		}
	};

	mouseUp = (): void => {
		if (this.transformOperation && this.selectionManager.selectedItem) {
			this.actionHistoryManager.recordTransform([ ...this.selectionManager.getSelectedInstances() ], { ...this.transformOperation });
			this.applyTransform(this.transformOperation, this.selectionManager);
		}

		this.isMouseDown = false;
		this.transformOperation = null;
		this.previewRect = null;
	};

	applyTransform = (op: TransformOperation, selection: ISelection): void => {
		switch (op.action) {
			case TransformKind.Move:
				if (selection.selectedItem.applyMove) {
					selection.selectedItems.forEach((item) => item.applyMove(op.move));
					this.onCanvasItemChange();
				}
				break;
			case TransformKind.Scale:
				if (selection.selectedItemCount > 1 && selection.canScale) {
					applyMultiScale(selection.selectedItems, op.scale.value, op.scale.node);
					this.onCanvasItemChange();
				} else if (selection.canScale) {
					selection.selectedItem.applyScale(op.scale.value, op.scale.node);
					this.onCanvasItemChange();
				}
				break;
			case TransformKind.Rotate:
				if (selection.canRotate) {
					selection.selectedItem.applyRotation(op.rotation);
				}
				break;
			default:
				break;
		}
	};

	private getScaleNodes = (rect: Rectangle, rotation: number, context?: BrushContext): { type: ScalingNode; node: Polygon }[] => {
		const { x, y } = rect.topLeftCorner;
		const { width, height } = rect;
		const halfWidth = Math.floor(width / 2);
		const halfHeight = Math.floor(height / 2);
		const center = centerOfRect(rect);

		return [
			{
				type: ScalingNode.TopLeft,
				node: this.scaleHandle(x, y, rotation, center, context),
			},
			{
				type: ScalingNode.TopMiddle,
				node: this.scaleHandle(x + halfWidth, y, rotation, center, context),
			},
			{
				type: ScalingNode.TopRight,
				node: this.scaleHandle(x + width, y, rotation, center, context),
			},
			{
				type: ScalingNode.MiddleLeft,
				node: this.scaleHandle(x, y + halfHeight, rotation, center, context),
			},
			{
				type: ScalingNode.MiddleRight,
				node: this.scaleHandle(x + width, y + halfHeight, rotation, center, context),
			},
			{
				type: ScalingNode.BottomLeft,
				node: this.scaleHandle(x, y + height, rotation, center, context),
			},
			{
				type: ScalingNode.BottomMiddle,
				node: this.scaleHandle(x + halfWidth, y + height, rotation, center, context),
			},
			{
				type: ScalingNode.BottomRight,
				node: this.scaleHandle(x + width, y + height, rotation, center, context),
			},
		];
	};

	private scaleHandle = (x: number, y: number, rotation: number, center: Vector2D, context?: BrushContext): Polygon => {
		const { mousePosition } = context || {};
		const rect = {
			topLeftCorner: vector(x - HANDLE_DIAMETER / 2, y - HANDLE_DIAMETER / 2),
			width: HANDLE_DIAMETER,
			height: HANDLE_DIAMETER,
		};

		let styles = handleStyles;

		if (mousePosition && pointInsideRect(mousePosition, rect)) {
			styles = handleStylesHovered;
		}

		if (hasRotation({ rotation })) {
			const scalingNode = {
				...rect,
				...styles,
			};

			return rotateRectAroundPoint(scalingNode, rotation, center);
		}

		return {
			...styles,
			points: rectToPoints(rect),
		};
	};

	private rotationHandle = (boundingRect: Rectangle, rotation: number, context?: BrushContext): [Line, Circle] => {
		const { mousePosition } = context || {};

		const boundingRectCenter = centerOfRect(boundingRect);

		let line: Line = {
			point1: vector(boundingRectCenter.x, boundingRect.topLeftCorner.y),
			point2: vector(boundingRectCenter.x, boundingRect.topLeftCorner.y - handleLineLength),
			strokeColor: handleLineStrokeColor,
			strokeWeight: handleLineStrokeWeight,
		};

		if (hasRotation({ rotation })) {
			line = rotateLineAroundPoint(line, rotation, boundingRectCenter);
		}

		const circle: Circle = {
			center: line.point2,
			radius: HANDLE_DIAMETER / 2,
		};

		let styles = handleStyles;
		if (mousePosition && pointInsideCircle(mousePosition, circle)) {
			styles = handleStylesHovered;
		}

		return [
			line,
			{ ...styles, ...circle },
		];
	};
}
