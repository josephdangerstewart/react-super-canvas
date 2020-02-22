import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
	faDrawPolygon,
	faCircleNotch,
	faMousePointer,
	faImage,
} from '@fortawesome/free-solid-svg-icons';
import { SetActiveBrushCallback } from '../../types/callbacks/SetActiveBrushCallback';
import IBrush, { DefaultBrushKind } from '../../types/IBrush';
import { ToggleButton } from './StyledButton';

const ICONS: { [x: string]: IconDefinition } = {
	[DefaultBrushKind.CircleBrush]: faCircleNotch,
	[DefaultBrushKind.PolygonBrush]: faDrawPolygon,
	[DefaultBrushKind.Selection]: faMousePointer,
	[DefaultBrushKind.ImageBrush]: faImage,
};

export interface BrushControlsProps {
	/**
	 * @description Sets the brush that the user is currently using
	 */
	setActiveBrush: SetActiveBrushCallback;

	/**
	 * @description The list of available brushes
	 */
	brushes: IBrush[];

	/**
	 * @description The `brushName` of the currently selected brush
	 */
	activeBrushName: string;
}

const DefaultBrushControls: React.FunctionComponent<BrushControlsProps> = ({
	setActiveBrush,
	brushes,
	activeBrushName,
}) => {
	let count = 1;
	return (
		<>
			{brushes.map((brush) => (
				<ToggleButton
					toggled={activeBrushName === brush.brushName}
					onClick={(): void => setActiveBrush(brush)}
					key={`brush-${brush.brushName}`}
				>
					{ICONS[brush.brushName] ? <FontAwesomeIcon icon={ICONS[brush.brushName]} /> : count++ }
				</ToggleButton>
			))}
		</>
	);
};

export default DefaultBrushControls;
