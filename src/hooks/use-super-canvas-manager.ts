import { useState, useRef, useEffect } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';
import SuperCanvasManager from '../api/SuperCanvasManager';
import IBackgroundElement from '../types/IBackgroundElement';
import IBrush from '../types/IBrush';
import StyleContext from '../types/context/StyleContext';
import { OnCanvasItemChangeCallback } from '../types/callbacks/OnCanvasItemChangeCallback';
import { OnSelectionChangeCallback } from '../types/callbacks/OnSelectionChangeCallback';
import JsonData from '../types/utility/JsonData';

export interface UseSuperCanvasManagerHook {
	canvasRef: React.MutableRefObject<HTMLCanvasElement>;
	superCanvasManager: ISuperCanvasManager;
	activeBrushName: string;
	styleContext: StyleContext;
}

/**
 * @description Initializes the super canvas manager
 */
export const useSuperCanvasManager = (activeBackgroundElement: IBackgroundElement, availableBrushes: IBrush[], onCanvasItemsChange?: OnCanvasItemChangeCallback, initialValue?: JsonData[], onSelectionChange?: OnSelectionChangeCallback): UseSuperCanvasManagerHook => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ activeBrushName, setActiveBrushName ] = useState('');
	const [ styleContext, setStyleContext ] = useState({});
	const [ superCanvasManager, setSuperCanvasManager ] = useState<ISuperCanvasManager>(null);

	useEffect(() => {
		if (canvasRef.current && !superCanvasManager) {
			const manager = new SuperCanvasManager();
			manager.init(canvasRef.current);
			manager.setActiveBackgroundElement(activeBackgroundElement);
			manager.setAvailableBrushes(availableBrushes);
			manager.onActiveBrushChange((brush): void => {
				setActiveBrushName(brush.brushName);
			});
			manager.onStyleContextChange((context) => {
				setStyleContext(context);
			});

			if (onSelectionChange) {
				manager.onSelectionChange(onSelectionChange);
			}

			if (initialValue) {
				manager.setCanvasItems(initialValue);
			}

			setSuperCanvasManager(manager);

			if (onCanvasItemsChange) {
				manager.onCanvasItemsChange(onCanvasItemsChange);
			}

			return (): void => {
				manager.destroy();
			};
		}

		return null;
	}, []);

	return {
		canvasRef,
		superCanvasManager,
		activeBrushName,
		styleContext,
	};
};
