export default interface JsonData {
	[key: string]: number | string | boolean | JsonData | JsonArray;
}

export interface JsonArray {
	[index: number]: number | string | boolean | JsonData | JsonArray;
}
