import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from './StyledButton';
import ISelection from '../../types/ISelection';

export interface CanvasControlsProps {
	/**
	 * @description Clears the canvas
	 */
	clear: () => void;

	/**
	 * @description Deletes the currently selected item
	 */
	deleteSelectedCanvasItems: () => void;

	/**
	 * @description The current selection
	 */
	currentSelection: ISelection;
}

const DefaultCanvasControls: React.FunctionComponent<CanvasControlsProps> = ({
	clear,
	deleteSelectedCanvasItems,
	currentSelection,
}) => (
	<>
		<Button onClick={clear}>
			<FontAwesomeIcon icon={faTimes} />
		</Button>
		{currentSelection && currentSelection.selectedItem && (
			<Button onClick={deleteSelectedCanvasItems}>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		)}
	</>
);

export default DefaultCanvasControls;
