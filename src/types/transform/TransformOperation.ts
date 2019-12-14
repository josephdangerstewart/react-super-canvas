import { TransformKind } from './TransformKind';
import { ScalingNode } from './ScalingNode';
import Vector2D from '../utility/Vector2D';

export interface TransformOperation {
	action: TransformKind;
	scale?: {
		node: ScalingNode;
		value: Vector2D;
	};
	move?: Vector2D;
	rotation?: number;
}
