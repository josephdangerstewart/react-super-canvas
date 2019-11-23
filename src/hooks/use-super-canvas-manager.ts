import { useState, useRef, useEffect } from 'react';
import ISuperCanvasManager from '../types/ISuperCanvasManager';
import SuperCanvasManager from '../api/SuperCanvasManager';
import IBackgroundElement from '../types/IBackgroundElement';
import IBrush from '../types/IBrush';

export interface UseSuperCanvasManagerHook {
	canvasRef: React.MutableRefObject<HTMLCanvasElement>;
	superCanvasManager: ISuperCanvasManager;
	activeBrushName: string;
}

/**
 * @description Initializes the super canvas manager
 */
export const useSuperCanvasManager = (activeBackgroundElement: IBackgroundElement, availableBrushes: IBrush[]): UseSuperCanvasManagerHook => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ activeBrushName, setActiveBrushName ] = useState('');
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

			setSuperCanvasManager(manager);

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
	};
};
