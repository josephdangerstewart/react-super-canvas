import React from 'react';
import IBrush from '../IBrush';
import { SetActiveBrushCallback } from './SetActiveBrushCallback';

export type RenderToolbarCallback = (setActiveBrush: SetActiveBrushCallback, brushes: IBrush[]) => React.ReactNode;
