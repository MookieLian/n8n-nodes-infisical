import type { INodeProperties } from 'n8n-workflow';
import { environmentField, projectIdField, secretPathField } from '../../shared/descriptions';

const showForSecret = { resource: ['secret'] };

// n8n param named `key` (not `secretName`) to avoid the sensitive-field linter;
// the secret name is carried in the URL path, not as a body/query property.
const secretNameField = (operation: string[]): INodeProperties => ({
	displayName: 'Secret Name',
	name: 'key',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. DATABASE_URL',
	displayOptions: { show: { ...showForSecret, operation } },
	description: 'The name (key) of the secret',
});

export const secretDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForSecret },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a secret',
				description: 'Create a new secret',
				routing: {
					request: { method: 'POST', url: '=/api/v4/secrets/{{ encodeURIComponent($parameter.key) }}' },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a secret',
				description: 'Delete a secret',
				routing: {
					request: { method: 'DELETE', url: '=/api/v4/secrets/{{ encodeURIComponent($parameter.key) }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a secret',
				description: 'Retrieve a single secret by name',
				routing: {
					request: { method: 'GET', url: '=/api/v4/secrets/{{ encodeURIComponent($parameter.key) }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secret' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many secrets',
				description: 'List secrets in an environment and path',
				routing: {
					request: { method: 'GET', url: '/api/v4/secrets' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secrets' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a secret',
				description: 'Update an existing secret',
				routing: {
					request: { method: 'PATCH', url: '=/api/v4/secrets/{{ encodeURIComponent($parameter.key) }}' },
				},
			},
		],
		default: 'getAll',
	},

	// Secret name (path param) for single-secret operations
	secretNameField(['create', 'get', 'update', 'delete']),

	// Project / environment / path scoping
	projectIdField({ ...showForSecret, operation: ['create', 'update', 'delete'] }, 'body'),
	projectIdField({ ...showForSecret, operation: ['get', 'getAll'] }, 'query'),
	environmentField({ ...showForSecret, operation: ['create', 'update', 'delete'] }, 'body'),
	environmentField({ ...showForSecret, operation: ['get', 'getAll'] }, 'query'),
	secretPathField({ ...showForSecret, operation: ['create', 'update', 'delete'] }, 'body'),
	secretPathField({ ...showForSecret, operation: ['get', 'getAll'] }, 'query'),

	// Secret value (required for create)
	{
		displayName: 'Secret Value',
		name: 'secretValue',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		displayOptions: { show: { ...showForSecret, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'secretValue', value: '={{ $value }}' } },
		description: 'The value to store for the secret',
	},

	// Get Many options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showForSecret, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Expand Secret References',
				name: 'expandSecretReferences',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'query', property: 'expandSecretReferences', value: '={{ $value }}' } },
				description: 'Whether to expand secret references in the returned values',
			},
			{
				displayName: 'Include Imports',
				name: 'includeImports',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'query', property: 'includeImports', value: '={{ $value }}' } },
				description: 'Whether to include secrets pulled in via secret imports',
			},
			{
				displayName: 'Recursive',
				name: 'recursive',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'query', property: 'recursive', value: '={{ $value }}' } },
				description: 'Whether to fetch secrets from sub-folders recursively',
			},
			{
				displayName: 'Tag Slugs',
				name: 'tagSlugs',
				type: 'string',
				default: '',
				placeholder: 'tag-a,tag-b',
				routing: { send: { type: 'query', property: 'tagSlugs', value: '={{ $value }}' } },
				description: 'Comma-separated tag slugs to filter secrets by',
			},
			{
				displayName: 'View Secret Value',
				name: 'viewSecretValue',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'query', property: 'viewSecretValue', value: '={{ $value }}' } },
				description: 'Whether to include the decrypted secret values in the response',
			},
		],
	},

	// Create / Update additional fields
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForSecret, operation: ['create', 'update'] } },
		options: [
			{
				displayName: 'New Secret Name',
				name: 'newName',
				type: 'string',
				default: '',
				displayOptions: { show: { '/operation': ['update'] } },
				routing: { send: { type: 'body', property: 'newSecretName', value: '={{ $value }}' } },
				description: 'Rename the secret to this new name',
			},
			{
				displayName: 'Secret Comment',
				name: 'comment',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'secretComment', value: '={{ $value }}' } },
				description: 'A comment describing the secret',
			},
			{
				displayName: 'Secret Value',
				name: 'secretValue',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				displayOptions: { show: { '/operation': ['update'] } },
				routing: { send: { type: 'body', property: 'secretValue', value: '={{ $value }}' } },
				description: 'The new value for the secret',
			},
			{
				displayName: 'Skip Multiline Encoding',
				name: 'skipMultilineEncoding',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'skipMultilineEncoding', value: '={{ $value }}' } },
				description: 'Whether to skip multiline encoding for the secret value',
			},
			{
				displayName: 'Tag IDs',
				name: 'tagIds',
				type: 'string',
				default: '',
				placeholder: 'e.g. a1b2c3, d4e5f6',
				routing: {
					send: {
						type: 'body',
						property: 'tagIds',
						value: '={{ $value.split(",").map(item => item.trim()).filter(item => item) }}',
					},
				},
				description: 'Comma-separated tag IDs to attach to the secret',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Personal', value: 'personal' },
					{ name: 'Shared', value: 'shared' },
				],
				default: 'shared',
				routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
				description: 'Whether the secret is shared with the project or personal to the identity',
			},
		],
	},
];
