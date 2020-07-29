import { TransformOperation } from '../../types/transform/TransformOperation';
import { TransformKind } from '../../types/transform/TransformKind';
import { vector } from '../../utility/shapes-util';
import { CanvasItemInstance } from '../../types/utility/CanvasItemInstance';

export enum ActionType {
	TransformCanvasItems,
	AddCanvasItems,
	DeleteCanvasItems,
}

export interface CanvasItemsAction {
	canvasItems: CanvasItemInstance[];
}

export interface TransformAction extends CanvasItemsAction {
	transformOperation: TransformOperation;
}

export interface ActionRecord {
	type: ActionType;
	data: TransformAction | CanvasItemsAction;
}

export default class ActionHistoryManager {
	private actionHistory: ActionRecord[];
	private redoHistory: ActionRecord[];
	private historySize = 10;

	constructor(historySize?: number) {
		this.actionHistory = [];
		this.redoHistory = [];
		if (historySize) {
			this.historySize = 10;
		}
	}

	recordTransform = (canvasItems: CanvasItemInstance[], transformOperation: TransformOperation): void => {
		this.actionHistory.push({
			type: ActionType.TransformCanvasItems,
			data: {
				canvasItems,
				transformOperation,
			},
		});
		this.onAddActionRecord();
	};

	recordAddCanvasItems = (canvasItems: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.AddCanvasItems,
			data: { canvasItems },
		});
		this.onAddActionRecord();
	};

	recordDeleteCanvasItems = (canvasItems: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.DeleteCanvasItems,
			data: { canvasItems },
		});
		this.onAddActionRecord();
	};

	getNextUndoAction = (): ActionRecord => {
		const nextAction = this.actionHistory.pop();

		if (!nextAction) {
			return null;
		}

		this.redoHistory.push(nextAction);

		if (nextAction.type === ActionType.AddCanvasItems) {
			return {
				type: ActionType.DeleteCanvasItems,
				data: nextAction.data,
			};
		}

		if (nextAction.type === ActionType.DeleteCanvasItems) {
			return {
				type: ActionType.AddCanvasItems,
				data: nextAction.data,
			};
		}

		if (nextAction.type === ActionType.TransformCanvasItems) {
			let reversedTransform: TransformOperation;
			const op = (nextAction.data as TransformAction).transformOperation;

			switch (op.action) {
				case TransformKind.Move:
					reversedTransform = {
						action: TransformKind.Move,
						move: vector(-op.move.x, -op.move.y),
					};

					break;
				case TransformKind.Scale:
					reversedTransform = {
						action: TransformKind.Scale,
						scale: {
							node: op.scale.node,
							value: vector(
								op.scale.value.x !== 0 ? 1 / op.scale.value.x : 0,
								op.scale.value.y !== 0 ? 1 / op.scale.value.y : 0,
							),
						},
					};

					break;
				case TransformKind.Rotate:
					reversedTransform = {
						action: TransformKind.Rotate,
						rotation: -op.rotation,
					};

					break;
				default:
					throw new Error('Unsupported transform kind');
			}

			return {
				type: ActionType.TransformCanvasItems,
				data: {
					canvasItems: nextAction.data.canvasItems,
					transformOperation: reversedTransform,
				},
			};
		}

		return null;
	};

	getNextRedoAction = (): ActionRecord => {
		const nextAction = this.redoHistory.pop();

		if (!nextAction) {
			return null;
		}

		this.actionHistory.push(nextAction);
		this.onAddActionRecord(false);

		return nextAction;
	};

	private onAddActionRecord = (clearRedoHistory = true): void => {
		if (this.actionHistory.length > this.historySize) {
			this.actionHistory.shift();
		}

		if (clearRedoHistory) {
			this.redoHistory = [];
		}
	};
}
