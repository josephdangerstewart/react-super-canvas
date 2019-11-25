import React, { useState } from 'react';
import Popover from 'react-tiny-popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import { Button } from './StyledButton';
import { StyleControlPopover } from './StyleControlPopover';
import StyleContext from '../../types/context/StyleContext';

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
	styleContext: StyleContext;
}

const DefaultStyleControls: React.FunctionComponent<StyleControlsProps> = ({
	setStyleContext,
	styleContext,
}) => {
	const [ isOpen, setIsOpen ] = useState(false);

	return (
		<Popover
			isOpen={isOpen}
			content={(
				<StyleControlPopover
					setStyleContext={setStyleContext}
					styleContext={styleContext}
				/>
			)}
			onClickOutside={(): void => setIsOpen(false)}
			position="bottom"
		>
			<Button onClick={(): void => setIsOpen(!isOpen)}>
				<FontAwesomeIcon icon={faSlidersH} />
			</Button>
		</Popover>
	);
};

export default DefaultStyleControls;
