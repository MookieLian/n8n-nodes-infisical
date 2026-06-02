import type { INodeProperties } from 'n8n-workflow';
import { environmentField, projectIdField } from '../../shared/descriptions';

const showForFolder = { resource: ['folder'] };

const folderPathField = (operation: string[], sendType: 'query' | 'body'): INodeProperties => ({
	displayName: 'Path',
	name: 'path',
	type: 'string',
	default: '/',
	displayOptions: { show: { ...showForFolder, operation } },
	routing: { send: { type: sendType, property: 'path', value: '={{ $value }}' } },
	description: 'Path of the parent folder. Defaults to the root path.',
});

export const folderDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForFolder },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a folder',
				description: 'Create a new folder',
				routing: {
					request: { method: 'POST', url: '/api/v2/folders' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'folder' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a folder',
				description: 'Delete a folder',
				routing: {
					request: { method: 'DELETE', url: '=/api/v2/folders/{{ encodeURIComponent($parameter.folderId) }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'folder' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a folder',
				description: 'Retrieve a single folder by ID',
				routing: {
					request: { method: 'GET', url: '=/api/v2/folders/{{ $parameter.folderId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'folder' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many folders',
				description: 'List folders in an environment and path',
				routing: {
					request: { method: 'GET', url: '/api/v2/folders' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'folders' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a folder',
				description: 'Update an existing folder',
				routing: {
					request: { method: 'PATCH', url: '=/api/v2/folders/{{ encodeURIComponent($parameter.folderId) }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'folder' } }] },
				},
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 3c90c3cc-0d44-4b50-8888-8dd25736052a',
		displayOptions: { show: { ...showForFolder, operation: ['get', 'update', 'delete'] } },
		description: 'The ID (or name, for delete) of the folder',
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForFolder, operation: ['create', 'update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'The name of the folder',
	},

	projectIdField({ ...showForFolder, operation: ['create', 'update', 'delete'] }, 'body'),
	projectIdField({ ...showForFolder, operation: ['getAll'] }, 'query'),
	environmentField({ ...showForFolder, operation: ['create', 'update', 'delete'] }, 'body'),
	environmentField({ ...showForFolder, operation: ['getAll'] }, 'query'),
	folderPathField(['create', 'update'], 'body'),
	folderPathField(['getAll'], 'query'),

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForFolder, operation: ['create', 'update'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'description', value: '={{ $value }}' } },
				description: 'An optional description of the folder',
			},
		],
	},
];
