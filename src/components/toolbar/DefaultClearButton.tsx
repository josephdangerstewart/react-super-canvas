import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from './StyledButton';

export interface ClearButtonProps {
	/**
	 * @description Clears the canvas
	 */
	clear: () => void;
}

const DefaultClearButton: React.FunctionComponent<ClearButtonProps> = ({ clear }) => (
	<Button onClick={clear}>
		<FontAwesomeIcon icon={faTimes} />
	</Button>
);

export default DefaultClearButton;
