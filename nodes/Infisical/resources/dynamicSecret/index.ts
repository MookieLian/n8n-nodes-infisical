import type { INodeProperties } from 'n8n-workflow';

const showForDynamic = { resource: ['dynamicSecret'] };

const projectSlugField = (operation: string[], sendType: 'query' | 'body'): INodeProperties => ({
	displayName: 'Project Slug',
	name: 'projectSlug',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. my-project-abc123',
	displayOptions: { show: { ...showForDynamic, operation } },
	routing: { send: { type: sendType, property: 'projectSlug', value: '={{ $value }}' } },
	description: 'The slug of the project (shown in the project settings/URL)',
});

const environmentSlugField = (operation: string[], sendType: 'query' | 'body'): INodeProperties => ({
	displayName: 'Environment Slug',
	name: 'environmentSlug',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. dev',
	displayOptions: { show: { ...showForDynamic, operation } },
	routing: { send: { type: sendType, property: 'environmentSlug', value: '={{ $value }}' } },
	description: 'The slug of the environment (e.g. dev, staging, prod)',
});

export const dynamicSecretDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForDynamic },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a dynamic secret',
				description: 'Create a new dynamic secret configuration',
				routing: {
					request: { method: 'POST', url: '/api/v1/dynamic-secrets' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'dynamicSecret' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a dynamic secret',
				description: 'Delete a dynamic secret configuration',
				routing: {
					request: { method: 'DELETE', url: '=/api/v1/dynamic-secrets/{{ encodeURIComponent($parameter.name) }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'dynamicSecret' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a dynamic secret',
				description: 'Retrieve a single dynamic secret by name',
				routing: {
					request: { method: 'GET', url: '=/api/v1/dynamic-secrets/{{ encodeURIComponent($parameter.name) }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'dynamicSecret' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many dynamic secrets',
				description: 'List dynamic secrets in an environment',
				routing: {
					request: { method: 'GET', url: '/api/v1/dynamic-secrets' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'dynamicSecrets' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a dynamic secret',
				description: 'Update an existing dynamic secret configuration',
				routing: {
					request: { method: 'PATCH', url: '=/api/v1/dynamic-secrets/{{ encodeURIComponent($parameter.name) }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'dynamicSecret' } }] },
				},
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForDynamic, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'The name of the dynamic secret',
	},
	{
		// get/update/delete carry the name in the URL path, so no routing here.
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForDynamic, operation: ['get', 'update', 'delete'] } },
		description: 'The name of the dynamic secret',
	},

	projectSlugField(['create', 'update', 'delete'], 'body'),
	projectSlugField(['get', 'getAll'], 'query'),
	environmentSlugField(['create', 'update', 'delete'], 'body'),
	environmentSlugField(['get', 'getAll'], 'query'),

	{
		displayName: 'Provider',
		name: 'provider',
		type: 'json',
		default: '{\n  "type": "postgres",\n  "inputs": {}\n}',
		required: true,
		displayOptions: { show: { ...showForDynamic, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'provider', value: '={{ $value }}' } },
		description:
			'The provider configuration object, with a "type" (e.g. postgres, redis, aws-iam) and provider-specific "inputs"',
	},
	{
		displayName: 'Default TTL',
		name: 'defaultTTL',
		type: 'string',
		default: '1h',
		required: true,
		placeholder: 'e.g. 1h, 30m',
		displayOptions: { show: { ...showForDynamic, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'defaultTTL', value: '={{ $value }}' } },
		description: 'The default lease time-to-live (e.g. 1h, 30m)',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForDynamic, operation: ['create'] } },
		options: [
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '/',
				routing: { send: { type: 'body', property: 'path', value: '={{ $value }}' } },
				description: 'The folder path the dynamic secret is stored under',
			},
			{
				displayName: 'Max TTL',
				name: 'maxTTL',
				type: 'string',
				default: '',
				placeholder: 'e.g. 24h',
				routing: { send: { type: 'body', property: 'maxTTL', value: '={{ $value }}' } },
				description: 'The maximum lease time-to-live',
			},
		],
	},

	{
		displayName: 'Provider Inputs',
		name: 'data',
		type: 'json',
		default: '{}',
		displayOptions: { show: { ...showForDynamic, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'data', value: '={{ $value }}' } },
		description: 'The updated provider-specific input values',
	},
];
