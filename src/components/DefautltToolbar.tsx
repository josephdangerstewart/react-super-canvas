import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDrawPolygon, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { RenderToolbarCallback } from '../types/callbacks/RenderToolbarCallback';
import { DefaultBrushKind } from '../types/IBrush';

const ICONS: { [x: string]: IconDefinition } = {
	[DefaultBrushKind.CircleBrush]: faCircleNotch,
	[DefaultBrushKind.PolygonBrush]: faDrawPolygon,
};

export const renderDefaultToolbar: RenderToolbarCallback = (setActiveBrush, brushes) => (
	<div>
		{brushes.map((brush) => ICONS[brush.brushName] && (
			<button onClick={(): void => setActiveBrush(brush)} key={`brush-${brush.brushName}`}>
				<FontAwesomeIcon icon={ICONS[brush.brushName]} />
			</button>
		))}
	</div>
);
