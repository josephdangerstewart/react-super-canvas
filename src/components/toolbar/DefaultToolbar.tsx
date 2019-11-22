import React from 'react';

export interface ToolbarProps {
	brushControls: React.ReactNode;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({ brushControls }) => (
	<div>
		{brushControls}
	</div>
);

export default Toolbar;
