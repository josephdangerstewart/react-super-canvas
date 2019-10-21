import IPainterAPI from './IPainterAPI';

export default interface ICanvasItem {
	render: (painter: IPainterAPI) => void;
}
