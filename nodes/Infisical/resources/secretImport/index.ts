import type { INodeProperties } from 'n8n-workflow';
import { environmentField, projectIdField } from '../../shared/descriptions';

const showForImport = { resource: ['secretImport'] };

// The source location to import from, sent as the nested `import` body object.
const importSourceFields: INodeProperties[] = [
	{
		displayName: 'Source Environment',
		name: 'importEnvironment',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. prod',
		displayOptions: { show: { ...showForImport, operation: ['create', 'update'] } },
		routing: {
			send: {
				type: 'body',
				property: 'import',
				value:
					'={{ { "environment": $parameter.importEnvironment, "path": $parameter.importPath } }}',
			},
		},
		description: 'The environment slug to import secrets from',
	},
	{
		displayName: 'Source Path',
		name: 'importPath',
		type: 'string',
		default: '/',
		displayOptions: { show: { ...showForImport, operation: ['create', 'update'] } },
		description: 'The folder path to import secrets from',
	},
];

export const secretImportDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForImport },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a secret import',
				description: 'Create a new secret import',
				routing: {
					request: { method: 'POST', url: '/api/v2/secret-imports' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secretImport' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a secret import',
				description: 'Delete a secret import',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v2/secret-imports/{{ $parameter.importId }}',
					},
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secretImport' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a secret import',
				description: 'Retrieve a single secret import by ID',
				routing: {
					request: { method: 'GET', url: '=/api/v2/secret-imports/{{ $parameter.importId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secretImport' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many secret imports',
				description: 'List secret imports in an environment and path',
				routing: {
					request: { method: 'GET', url: '/api/v2/secret-imports' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secretImports' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a secret import',
				description: 'Update an existing secret import',
				routing: {
					request: { method: 'PATCH', url: '=/api/v2/secret-imports/{{ $parameter.importId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'secretImport' } }] },
				},
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Secret Import ID',
		name: 'importId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForImport, operation: ['get', 'update', 'delete'] } },
		description: 'The ID of the secret import',
	},

	projectIdField({ ...showForImport, operation: ['create', 'update', 'delete'] }, 'body'),
	projectIdField({ ...showForImport, operation: ['getAll'] }, 'query'),
	environmentField({ ...showForImport, operation: ['create', 'update', 'delete'] }, 'body'),
	environmentField({ ...showForImport, operation: ['getAll'] }, 'query'),
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		default: '/',
		displayOptions: { show: { ...showForImport, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'path', value: '={{ $value }}' } },
		description: 'The destination folder path the import is added to',
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		default: '/',
		displayOptions: { show: { ...showForImport, operation: ['getAll'] } },
		routing: { send: { type: 'query', property: 'path', value: '={{ $value }}' } },
		description: 'The destination folder path to list imports from',
	},

	...importSourceFields,
];
