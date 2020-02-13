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

export interface IndexSignatureParameter extends Property {
	name: string;
}

export interface IndexSignature {
	parameters: IndexSignatureParameter[];
	type: TypedProperty;
}

export interface InterfaceMetadata {
	indexSignature?: IndexSignature;
	properties?: PropertyList;
}
