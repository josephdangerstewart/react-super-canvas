import React from 'react';
import { faFillDrip, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import StyleContext from '../../types/context/StyleContext';
import ColorInputPopover from './ColorInputPopover';
import ISelection from '../../types/ISelection';

export interface StyleControlsProps {
	/**
	 * @description Sets the style context. Only provided values are set, undefined values
	 * ignored.
	 */
	setStyleContext: SetStyleContextCallback;

	/**
	 * @description The current style context.
	 */
	styleContext: StyleContext;

	/**
	 * @description The current selection of canvas items
	 */
	currentSelection?: ISelection;
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
