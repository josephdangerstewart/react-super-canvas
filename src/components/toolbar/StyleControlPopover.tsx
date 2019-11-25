import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import StyleContext from '../../types/context/StyleContext';

export const PopoverContentWrapper = styled.div`
	background-color: #F8F8F8;
	padding: 8px;
	border-radius: 4px;
	z-index: 10px;
`;

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
	styleContext: StyleContext;
}

export const StyleControlPopover: React.FunctionComponent<StyleControlsProps> = ({
	setStyleContext,
	styleContext,
}) => (
	<PopoverContentWrapper>
		<div>
			<FontAwesomeIcon icon={faFillDrip} />
			<input
				type="color"
				onChange={(event): void => {
					setStyleContext({ fillColor: event.target.value, fillImageUrl: '' });
				}}
				value={styleContext.fillColor}
			/>
		</div>
	</PopoverContentWrapper>
);
