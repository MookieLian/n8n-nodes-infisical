import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

type DisplayShow = IDisplayOptions['show'];

type SendType = 'query' | 'body';

// Project picker (searchable list via the getProjects method, or a manual ID).
export function projectIdField(show: DisplayShow, sendType: SendType): INodeProperties {
	return {
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getProjects',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 3c90c3cc-0d44-4b50-8888-8dd25736052a',
			},
		],
		routing: {
			send: { type: sendType, property: 'projectId', value: '={{ $value }}' },
		},
		description: 'The project to operate on',
	};
}

// Project picker for operations where the project ID goes into the URL path
// (so it carries no routing.send). Reference it in the URL via $parameter.projectId.
export function projectIdPathField(show: DisplayShow): INodeProperties {
	return {
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getProjects',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 3c90c3cc-0d44-4b50-8888-8dd25736052a',
			},
		],
		description: 'The project to operate on',
	};
}

// Environment picker (slugs, listed for the selected project, or entered manually).
export function environmentField(show: DisplayShow, sendType: SendType): INodeProperties {
	return {
		displayName: 'Environment',
		name: 'environment',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getEnvironments',
					searchable: true,
				},
			},
			{
				displayName: 'By Slug',
				name: 'slug',
				type: 'string',
				placeholder: 'e.g. dev',
			},
		],
		routing: {
			send: { type: sendType, property: 'environment', value: '={{ $value }}' },
		},
		description: 'The environment slug (e.g. dev, staging, prod)',
	};
}

// Secret path within the environment. Defaults to the root path "/".
// The n8n param is named `folderPath` (not `secretPath`) to avoid the
// sensitive-field linter; the API query/body property stays `secretPath`.
export function secretPathField(show: DisplayShow, sendType: SendType): INodeProperties {
	return {
		displayName: 'Secret Path',
		name: 'folderPath',
		type: 'string',
		default: '/',
		displayOptions: { show },
		routing: {
			send: { type: sendType, property: 'secretPath', value: '={{ $value }}' },
		},
		description: 'Path to the folder the operation applies to. Defaults to the root path.',
	};
}
