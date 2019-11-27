import React from 'react';
import { faFillDrip, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import StyleContext from '../../types/context/StyleContext';
import ColorInputPopover from './ColorInputPopover';

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
	styleContext: StyleContext;
}

const DefaultStyleControls: React.FunctionComponent<StyleControlsProps> = ({
	setStyleContext,
	styleContext,
}) => (
	<>
		<ColorInputPopover
			setStyleContext={setStyleContext}
			styleContext={styleContext}
			icon={faFillDrip}
			styleContextKey="fillColor"
			canClear
		/>
		<ColorInputPopover
			setStyleContext={setStyleContext}
			styleContext={styleContext}
			icon={faPaintBrush}
			styleContextKey="strokeColor"
		/>
	</>
);

export default DefaultStyleControls;
