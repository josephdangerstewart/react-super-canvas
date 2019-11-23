import React from 'react';

export interface ToolbarProps {
	brushControls: React.ReactNode;
	styleControls: React.ReactNode;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({ brushControls, styleControls }) => (
	<div>
		{brushControls}
		{styleControls}
	</div>
);

export default Toolbar;
