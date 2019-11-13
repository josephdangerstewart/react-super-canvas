import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrawPolygon, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { RenderToolbarCallback } from '../types/callbacks/RenderToolbarCallback';

export const renderDefaultToolbar: RenderToolbarCallback = () => (
	<div>
		<button onClick={() => console.log('polygon brush')}>
			<FontAwesomeIcon icon={faDrawPolygon} />
		</button>
		<button onClick={() => console.log('circle brush')}>
			<FontAwesomeIcon icon={faCircleNotch} />
		</button>
	</div>
);
