import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDrawPolygon, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { SetActiveBrushCallback } from '../../types/callbacks/SetActiveBrushCallback';
import IBrush, { DefaultBrushKind } from '../../types/IBrush';

const ICONS: { [x: string]: IconDefinition } = {
	[DefaultBrushKind.CircleBrush]: faCircleNotch,
	[DefaultBrushKind.PolygonBrush]: faDrawPolygon,
};

export interface BrushControlsProps {
	setActiveBrush: SetActiveBrushCallback;
	brushes: IBrush[];
}

const DefaultBrushControls: React.FunctionComponent<BrushControlsProps> = ({
	setActiveBrush,
	brushes,
}) => {
	let count = 1;
	return (
		<>
			{brushes.map((brush) => (
				<button onClick={(): void => setActiveBrush(brush)} key={`brush-${brush.brushName}`}>
					{ICONS[brush.brushName] ? <FontAwesomeIcon icon={ICONS[brush.brushName]} /> : count++ }
				</button>
			))}
		</>
	);
};

export default DefaultBrushControls;
