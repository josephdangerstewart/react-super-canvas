import React from 'react';
import styled from 'styled-components';

const DefaultToolbarContainer = styled.div`
	position: absolute;
	top: 10px;
	left: 10px;

	box-shadow: 0px 0px 27px -1px rgba(0,0,0,.5);
	padding: 8px;
	background-color: #F8F8F8;
	display: flex;
	border-radius: 4px;
`;

export interface ToolbarProps {
	brushControls: React.ReactNode;
	styleControls: React.ReactNode;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({ brushControls, styleControls }) => (
	<DefaultToolbarContainer>
		{brushControls}
		{styleControls}
	</DefaultToolbarContainer>
);

export default Toolbar;
