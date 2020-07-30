import { TransformOperation } from '../../types/transform/TransformOperation';
import { TransformKind } from '../../types/transform/TransformKind';
import { vector } from '../../utility/shapes-util';
import { CanvasItemInstance } from '../../types/utility/CanvasItemInstance';

export enum ActionType {
	TransformCanvasItems,
	AddCanvasItems,
	DeleteCanvasItems,
	LockCanvasItems,
	UnlockCanvasItems,
	SetArrangement,
}

export interface CanvasItemsAction {
	canvasItems: CanvasItemInstance[];
}

export interface TransformAction extends CanvasItemsAction {
	transformOperation: TransformOperation;
}

interface CanvasItemChangeSetAction extends CanvasItemsAction {
	previousCanvasItems: CanvasItemInstance[];
}

interface ActionRecordInternal {
	type: ActionType;
	data: TransformAction | CanvasItemsAction | CanvasItemChangeSetAction;
}

export interface ActionRecord {
	type: ActionType;
	data: TransformAction | CanvasItemsAction;
}

export default class ActionHistoryManager {
	private actionHistory: ActionRecordInternal[];
	private redoHistory: ActionRecordInternal[];
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
				canvasItems: canvasItems.slice(),
				transformOperation,
			},
		});
		this.onAddActionRecord();
	};

	recordAddCanvasItems = (canvasItems: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.AddCanvasItems,
			data: { canvasItems: canvasItems.slice() },
		});
		this.onAddActionRecord();
	};

	recordDeleteCanvasItems = (canvasItems: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.DeleteCanvasItems,
			data: { canvasItems: canvasItems.slice() },
		});
		this.onAddActionRecord();
	};

	recordLockItems = (canvasItems: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.LockCanvasItems,
			data: { canvasItems: canvasItems.slice() },
		});
		this.onAddActionRecord();
	};

	recordUnlockItems = (canvasItems: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.UnlockCanvasItems,
			data: { canvasItems: canvasItems.slice() },
		});
		this.onAddActionRecord();
	};

	recordRearrange = (previousArrangement: CanvasItemInstance[], currentArrangement: CanvasItemInstance[]): void => {
		this.actionHistory.push({
			type: ActionType.SetArrangement,
			data: {
				previousCanvasItems: previousArrangement.slice(),
				canvasItems: currentArrangement.slice(),
			},
		});
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

		if (nextAction.type === ActionType.LockCanvasItems) {
			return {
				type: ActionType.UnlockCanvasItems,
				data: nextAction.data,
			};
		}

		if (nextAction.type === ActionType.UnlockCanvasItems) {
			return {
				type: ActionType.LockCanvasItems,
				data: nextAction.data,
			};
		}

		if (nextAction.type === ActionType.SetArrangement) {
			const data = (nextAction.data as CanvasItemChangeSetAction);
			return {
				type: ActionType.SetArrangement,
				data: {
					canvasItems: data.previousCanvasItems,
				},
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
