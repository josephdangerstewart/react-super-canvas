import Vector2D from '../../types/utility/Vector2D';
import { vector } from '../../utility/shapes-util';

/**
 * @description This class registers all dom events that perform data calculations needed
 * by the super canvas. It exists to abstract out some of the pan/zoom/coordinate geometry
 * logic from the super canvas manager to keep that code clean. It keeps track of the following
 *
 * 1. **User mouse position** (absolute and virtual)
 * 2. **Pan offset**
 * 3. **Zoom**
 * 4. **Keys down**
 */
export default class CanvasInteractionManager {
	private totalPanOffset: Vector2D;
	private panDiff: Vector2D;
	private mouseDownAt: Vector2D;
	private canvas: HTMLCanvasElement;
	private canvasPos: Vector2D;

	private _scale: number;
	private _keysDown: Record<string, boolean>;
	private _isMouseDown: boolean;
	private _isPanning: boolean;
	private _userMousePosition: Vector2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.totalPanOffset = vector(0, 0);
		this.panDiff = vector(0, 0);
		this._userMousePosition = vector(0, 0);
		this.canvasPos = vector(0, 0);
		this._scale = 1.0;
		this._keysDown = {};

		// Attach the events
		document.addEventListener('keydown', this.onKeyDown);
		document.addEventListener('keyup', this.onKeyUp);
		this.canvas.addEventListener('mousedown', this.onMouseDown);
		this.canvas.addEventListener('mouseup', this.onMouseUp);
		this.canvas.addEventListener('mouseout', this.onMouseOut);
		this.canvas.addEventListener('mousemove', this.onMouseMove);

		this.update();
	}

	/**
	 * @description The zoom factor
	 */
	get scale(): number {
		return this._scale;
	}

	/**
	 * @description The keys that are down
	 */
	get keysDown(): Record<string, boolean> {
		return this._keysDown;
	}

	/**
	 * @description Whether the mouse is down
	 */
	get isMouseDown(): boolean {
		return this._isMouseDown;
	}

	/**
	 * @description Used to track panning (panning begins when the user clicks while holding shift)
	 */
	get isPanning(): boolean {
		return this._isPanning;
	}

	/**
	 * @description The offset of the panning. (10, 10) would put the origin at (-10, -10)
	 */
	get panOffset(): Vector2D {
		return {
			x: this.totalPanOffset.x + this.panDiff.x,
			y: this.totalPanOffset.y + this.panDiff.y,
		};
	}

	/**
	 * @description The user mouse position in the virtual space
	 */
	get mousePosition(): Vector2D {
		return this.absolutePosToVirtualPos(this._userMousePosition);
	}

	/**
	 * @description The user mouse position on the canvas element
	 */
	get absoluteMousePosition(): Vector2D {
		return this._userMousePosition;
	}

	/**
	 * @description The virtual position of the top left corner of the canvas
	 */
	get virtualTopLeftCorner(): Vector2D {
		return this.absolutePosToVirtualPos(vector(0, 0));
	}

	/**
	 * @description Removes the dom events
	 */
	destroy = (): void => {
		document.removeEventListener('keydown', this.onKeyDown);
		document.removeEventListener('keyup', this.onKeyUp);
		this.canvas.removeEventListener('mousedown', this.onMouseDown);
		this.canvas.removeEventListener('mouseup', this.onMouseUp);
		this.canvas.removeEventListener('mouseout', this.onMouseOut);
		this.canvas.removeEventListener('mousemove', this.onMouseMove);
	};

	/**
	 * @description Does important calculations to maintain the interaction state. MUST be called at the beginning
	 * of the canvas update loop
	 */
	update = (): void => {
		const rect = this.canvas.getBoundingClientRect();
		this.canvasPos = {
			x: rect.left,
			y: rect.top,
		};
	};

	/* PRIVATE METHODS */

	private absolutePosToVirtualPos = (virtualMousePos: Vector2D): Vector2D => ({
		x: virtualMousePos.x + this.totalPanOffset.x + this.panDiff.x,
		y: virtualMousePos.y + this.totalPanOffset.y + this.panDiff.y,
	});

	private screenPosToAbsolutePos = (screenPos: Vector2D): Vector2D => ({
		x: screenPos.x - this.canvasPos.x,
		y: screenPos.y - this.canvasPos.y,
	});

	private onKeyDown = (event: KeyboardEvent): void => {
		this._keysDown[event.key] = true;
	};

	private onKeyUp = (event: KeyboardEvent): void => {
		this._keysDown[event.key] = false;
	};

	private onMouseDown = (event: MouseEvent): void => {
		this._isMouseDown = true;
		this.mouseDownAt = this.screenPosToAbsolutePos(vector(event.clientX, event.clientY));
		this.panDiff = vector(0, 0);

		if (this._keysDown.Shift) {
			this._isPanning = true;
			this.panDiff = vector(0, 0);
		}
	};

	private onMouseUp = (): void => {
		if (this._isPanning) {
			this.totalPanOffset.x += this.panDiff.x;
			this.totalPanOffset.y += this.panDiff.y;
		}

		this._isMouseDown = false;
		this._isPanning = false;
		this.mouseDownAt = null;
		this.panDiff = vector(0, 0);
	};

	private onMouseOut = (): void => {
		this.onMouseUp();
	};

	private onMouseMove = (event: MouseEvent): void => {
		this._userMousePosition = this.screenPosToAbsolutePos(vector(event.clientX, event.clientY));
		const { x: curX, y: curY } = this._userMousePosition;

		if (this._isPanning) {
			this.panDiff.x = this.mouseDownAt.x - curX;
			this.panDiff.y = this.mouseDownAt.y - curY;
		}
	};
}
