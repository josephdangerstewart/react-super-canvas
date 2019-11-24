import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import { Button } from './StyledButton';

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
}

const DefaultStyleControls: React.FunctionComponent<StyleControlsProps> = ({
	setStyleContext,
}) => (
	<Button onClick={(): void => setStyleContext({ fillColor: 'orange' })}>
		<FontAwesomeIcon icon={faSlidersH} />
	</Button>
);

export default DefaultStyleControls;
