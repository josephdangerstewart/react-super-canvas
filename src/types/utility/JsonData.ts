export type PureData = (
	number |
	string |
	boolean |
	JsonData |
	JsonArray
);

export default interface JsonData {
	[key: string]: PureData;
}

export interface JsonArray {
	[index: number]: PureData;
}
