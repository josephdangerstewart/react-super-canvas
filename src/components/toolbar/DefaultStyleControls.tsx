import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
}

const DefaultStyleControls: React.FunctionComponent<StyleControlsProps> = ({
	setStyleContext,
}) => (
	<button onClick={(): void => setStyleContext({ fillColor: 'orange' })}>
		<FontAwesomeIcon icon={faSlidersH} />
	</button>
);

export default DefaultStyleControls;
