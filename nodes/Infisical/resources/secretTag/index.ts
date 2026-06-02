import type { INodeProperties } from 'n8n-workflow';
import { projectIdPathField } from '../../shared/descriptions';

const showForTag = { resource: ['secretTag'] };

export const secretTagDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForTag },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a secret tag',
				description: 'Create a new secret tag',
				routing: {
					request: { method: 'POST', url: '=/api/v1/projects/{{ $parameter.projectId }}/tags' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'tag' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a secret tag',
				description: 'Delete a secret tag',
				routing: {
					request: { method: 'DELETE', url: '=/api/v1/projects/{{ $parameter.projectId }}/tags/{{ $parameter.tagId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'tag' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a secret tag',
				description: 'Retrieve a single secret tag by ID',
				routing: {
					request: { method: 'GET', url: '=/api/v1/projects/{{ $parameter.projectId }}/tags/{{ $parameter.tagId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'tag' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many secret tags',
				description: 'List the secret tags in a project',
				routing: {
					request: { method: 'GET', url: '=/api/v1/projects/{{ $parameter.projectId }}/tags' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'tags' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a secret tag',
				description: 'Update an existing secret tag',
				routing: {
					request: { method: 'PATCH', url: '=/api/v1/projects/{{ $parameter.projectId }}/tags/{{ $parameter.tagId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'tag' } }] },
				},
			},
		],
		default: 'getAll',
	},

	projectIdPathField({ ...showForTag, operation: ['create', 'get', 'getAll', 'update', 'delete'] }),

	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForTag, operation: ['get', 'update', 'delete'] } },
		description: 'The ID of the secret tag',
	},

	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. backend',
		displayOptions: { show: { ...showForTag, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'slug', value: '={{ $value }}' } },
		description: 'A unique slug for the tag',
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		default: '#000000',
		displayOptions: { show: { ...showForTag, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'color', value: '={{ $value }}' } },
		description: 'The color of the tag',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForTag, operation: ['update'] } },
		options: [
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'slug', value: '={{ $value }}' } },
				description: 'The new slug for the tag',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '#000000',
				routing: { send: { type: 'body', property: 'color', value: '={{ $value }}' } },
				description: 'The new color of the tag',
			},
		],
	},
];
