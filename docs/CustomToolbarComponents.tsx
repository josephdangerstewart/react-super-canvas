import React from 'react';
import styled from 'styled-components';
import { ToolbarProps } from '../src/components/toolbar/DefaultToolbar';
import { BrushControlsProps } from '../src/components/toolbar/DefaultBrushControls';
import { StyleControlsProps } from '../src/components/toolbar/DefaultStyleControls';
import { CanvasControlsProps } from '../src/components/toolbar/DefaultCanvasControls';

const MyCoolToolbarContainer = styled.div`
	display: flex;
	background: lightgreen;
	position: absolute;
	top: 10px;
	left: 10px;
	align-items: center;
	border-radius: 4px;
`;

const ControlsContainer = styled.div`
	padding: 8px;
	border-right: solid 1px black;
	display: flex;
	align-items: center;

	&:last-child {
		border-right: none;
	}
`;

export const MyCoolToolbar: React.FunctionComponent<ToolbarProps> = ({
	canvasControls,
	brushControls,
	styleControls,
}) => (
	<MyCoolToolbarContainer>
		<ControlsContainer>
			{brushControls}
		</ControlsContainer>
		<ControlsContainer>
			{styleControls}
		</ControlsContainer>
		<ControlsContainer>
			{canvasControls}
		</ControlsContainer>
	</MyCoolToolbarContainer>
);

export const MyCoolBrushControls: React.FunctionComponent<BrushControlsProps> = ({
	brushes,
	activeBrushName,
	setActiveBrush,
}) => (
	<select
		value={activeBrushName}
		onChange={(event): void => {
			const brush = brushes.find((b) => b.brushName === event.target.value);
			if (brush) {
				setActiveBrush(brush);
			}
		}}
	>
		{brushes.map((brush) => (
			<option value={brush.brushName} key={brush.brushName}>{brush.brushName}</option>
		))}
	</select>
);

export const MyCoolStyleControls: React.FunctionComponent<StyleControlsProps> = ({
	setStyleContext,
	styleContext,
}) => (
	<button
		onClick={(): void => setStyleContext({
			fillColor: styleContext.fillColor === '#D10000' ? '#0072BB' : '#D10000',
		})}
		style={{ borderColor: styleContext.fillColor || '' }}
	>
		Set fill to {styleContext.fillColor === '#D10000' ? 'blue' : 'red'}
	</button>
);

export const MyCoolCanvasControls: React.FunctionComponent<CanvasControlsProps> = ({
	clear,
	currentSelection,
	deleteSelectedCanvasItems,
}) => (
	<button
		onClick={(): void => {
			if (currentSelection && currentSelection.selectedItemCount > 0) {
				deleteSelectedCanvasItems();
			} else {
				clear();
			}
		}}
	>
		{currentSelection && currentSelection.selectedItemCount > 0 ? 'Delete selection' : 'Delete all'}
	</button>
);
