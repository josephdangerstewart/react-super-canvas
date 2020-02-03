export interface PropertyList {
	[propertyName: string]: Property;
}

export interface Property {
	description: string;
	default?: string;
	inheritedFrom?: string;
	isArray?: boolean;
	parameters?: PropertyList;
	returnType?: string;
	isOptional?: boolean;
	type: string;
}
