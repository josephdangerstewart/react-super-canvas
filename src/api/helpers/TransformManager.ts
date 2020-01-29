import IPainterAPI from '../../types/IPainterAPI';
import ISelection from '../../types/ISelection';
import Rectangle from '../../types/shapes/Rectangle';
import StyledShape from '../../types/shapes/StyledShape';
import {
	vector,
	pointInsideRect,
	boundingRectOfRects,
} from '../../utility/shapes-util';
import { ScalingNode } from '../../types/transform/ScalingNode';
import { TransformKind } from '../../types/transform/TransformKind';
import { TransformOperation } from '../../types/transform/TransformOperation';
import Vector2D from '../../types/utility/Vector2D';
import { BrushContext } from '../../types/context/BrushContext';
import { applyMultiScale } from '../../utility/transform-utility';

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

/**
 * This class exists to abstract the canvas item transform logic away from the SuperCanvasManager
 */
export class TransformManager {
	private selectionManager: ISelection;
	private isMouseDown: boolean;

	private transformOperation: TransformOperation;
	private selectedItemBoundingRect: Rectangle;
	private previewRect: Rectangle;

	private mouseDownAt: Vector2D;

	constructor(selectionManager: ISelection) {
		this.selectionManager = selectionManager;
		this.mouseDownAt = vector(0, 0);
	}

	render = (painter: IPainterAPI, context: BrushContext): void => {
		const canvasItems = this.selectionManager.selectedItems;
		const { snappedMousePosition } = context;

		if (!canvasItems?.length) {
			return;
		}

		const boundingRect = this.previewRect || boundingRectOfRects(canvasItems.map((item) => item.getBoundingRect()));
		const { canMove, canScale } = this.selectionManager;

		painter.drawRect({
			...boundingRect,
			...boundingRectangleStyles,
		});


		if (canMove && pointInsideRect(snappedMousePosition, boundingRect)) {
			painter.setCursor('move');
		}

		if (canScale) {
			this.getScaleNodes(boundingRect, context).forEach((node) => {
				painter.drawRect(node.node);

				if (pointInsideRect(snappedMousePosition, node.node)) {
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
	};

	mouseDown = (context: BrushContext): void => {
		this.isMouseDown = true;
		const canvasItems = this.selectionManager.selectedItems;
		const { snappedMousePosition, mousePosition } = context;

		this.mouseDownAt = { ...snappedMousePosition };

		if (!canvasItems?.length) {
			return;
		}

		const { canScale, canMove } = this.selectionManager;

		const boundingRect = boundingRectOfRects(canvasItems.map((item) => item.getBoundingRect()));
		this.selectedItemBoundingRect = boundingRect;
		this.previewRect = boundingRect;
		const scaleNode = canScale && this.getScaleNodes(boundingRect).find(({ node }) => pointInsideRect(mousePosition, node));

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
		}
	};

	mouseUp = (): void => {
		if (this.transformOperation && this.selectionManager.selectedItem) {
			switch (this.transformOperation.action) {
				case TransformKind.Move:
					if (this.selectionManager.selectedItem.applyMove) {
						this.selectionManager.selectedItems.forEach((item) => item.applyMove(this.transformOperation.move));
					}
					break;
				case TransformKind.Scale:
					if (this.selectionManager.selectedItemCount > 1 && this.selectionManager.selectedItems.every((item) => item.applyMove && item.applyScale)) {
						applyMultiScale(this.selectionManager.selectedItems, this.transformOperation.scale.value, this.transformOperation.scale.node);
					} else if (this.selectionManager.selectedItem.applyScale) {
						this.selectionManager.selectedItem.applyScale(this.transformOperation.scale.value, this.transformOperation.scale.node);
					}
					break;
				default:
					break;
			}
		}

		this.isMouseDown = false;
		this.transformOperation = null;
		this.previewRect = null;
	};

	private getScaleNodes = (rect: Rectangle, context?: BrushContext): { type: ScalingNode; node: Rectangle }[] => {
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

	private scaleHandle = (x: number, y: number, context?: BrushContext): Rectangle => {
		const { snappedMousePosition } = context || { snappedMousePosition: null };
		const rect = {
			topLeftCorner: vector(x - HANDLE_DIAMETER / 2, y - HANDLE_DIAMETER / 2),
			width: HANDLE_DIAMETER,
			height: HANDLE_DIAMETER,
		};

		let styles = handleStyles;

		if (snappedMousePosition && pointInsideRect(snappedMousePosition, rect)) {
			styles = handleStylesHovered;
		}

		return {
			...rect,
			...styles,
		};
	};
}
