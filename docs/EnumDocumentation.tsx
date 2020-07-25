import React from 'react';
import {
	CodeSnippet, Property, PropertyName, PropertyDefault,
} from './styled';

export interface EnumMember {
	name: string;
	value?: string;
}

export interface EnumMeta {
	name: string;
	members: EnumMember[];
}

export interface EnumDocumentationProps {
	meta: EnumMeta;
}

const EnumMemberDocumentation: React.FC<{ member: EnumMember; isLast: boolean }> = ({
	member,
	isLast,
}) => (
	<Property verticalMargin={2}>
		<PropertyName>{member.name}</PropertyName>
		{member.value && (
			<>
				&nbsp;=&nbsp;
				<PropertyDefault type="string">{member.value}</PropertyDefault>
			</>
		)}
		{!isLast && ','}
	</Property>
);

export const EnumDocumentation: React.FC<EnumDocumentationProps> = ({
	meta,
}) => (
	<CodeSnippet>
		{meta.members.map((m, index) => (
			<EnumMemberDocumentation member={m} key={m.name} isLast={index === meta.members.length - 1} />
		))}
	</CodeSnippet>
);
