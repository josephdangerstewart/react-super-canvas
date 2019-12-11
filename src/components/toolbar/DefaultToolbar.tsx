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

const VerticalDivider = styled.div`
	margin: 0 4px;
	border: solid 1px #F0F0F0;
	border-radius: 2px;
`;

export interface ToolbarProps {
	/**
	 * @description The brush control components defined by the [brush controls](#brushcontrols)
	 */
	brushControls: React.ReactNode;

	/**
	 * @description The style control components defined by the [style controls](#stylecontrols)
	 */
	styleControls: React.ReactNode;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({ brushControls, styleControls }) => (
	<DefaultToolbarContainer>
		{brushControls}
		<VerticalDivider />
		{styleControls}
	</DefaultToolbarContainer>
);

export default Toolbar;
