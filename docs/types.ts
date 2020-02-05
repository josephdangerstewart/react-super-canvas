export interface PropertyList {
	[propertyName: string]: Property;
}

export interface TypedProperty {
	type: string;
	typeArguments?: TypedProperty[];
	isArray?: boolean;
	typeUnion?: TypedProperty[];
	parameters?: PropertyList;
	returnType?: TypedProperty;
}

export interface Property extends TypedProperty {
	description: string;
	default?: string;
	inheritedFrom?: string;
	isOptional?: boolean;
}
