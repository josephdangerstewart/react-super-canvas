import React from 'react';
import styled from 'styled-components';

const DefaultToolbarContainer = styled.div`
	position: absolute;
	top: 10px;
	left: 10px;

	box-shadow: 0px 0px 27px -1px rgba(0,0,0,.5);
	background-color: #F8F8F8;
	display: flex;
	border-radius: 4px;
`;

const VerticalDivider = styled.div`
	border: solid 1px #E0E0E0;
	border-radius: 2px;
`;

const ToolbarSection = styled.div`
	padding: 8px;
	display: flex;
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

	/**
	 * @description The canvas controls defined by the [canvas controls](#canvascontrols)
	 */
	canvasControls: React.ReactNode;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = ({ brushControls, styleControls, canvasControls }) => (
	<DefaultToolbarContainer>
		<ToolbarSection>
			{brushControls}
		</ToolbarSection>
		<VerticalDivider />
		<ToolbarSection>
			{styleControls}
		</ToolbarSection>
		<VerticalDivider />
		<ToolbarSection>
			{canvasControls}
		</ToolbarSection>
	</DefaultToolbarContainer>
);

export default Toolbar;
