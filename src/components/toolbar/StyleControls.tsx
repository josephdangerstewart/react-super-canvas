import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';

export const PopoverContentWrapper = styled.div`
	background-color: #F8F8F8;
	padding: 8px;
	border-radius: 4px;
	z-index: 10px;
`;

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
}

export const StyleControls: React.FunctionComponent<StyleControlsProps> = ({ setStyleContext }) => (
	<PopoverContentWrapper>
		<div>
			<FontAwesomeIcon icon={faFillDrip} />
			<input
				type="color"
				onChange={(event): void => {
					setStyleContext({ fillColor: event.target.value, fillImageUrl: '' });
				}}
			/>
		</div>
	</PopoverContentWrapper>
);
