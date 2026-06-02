import type { INodeProperties } from 'n8n-workflow';
import { projectIdPathField } from '../../shared/descriptions';

const showForEnv = { resource: ['environment'] };

export const environmentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForEnv },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an environment',
				description: 'Create a new environment in a project',
				routing: {
					request: { method: 'POST', url: '=/api/v1/projects/{{ $parameter.projectId }}/environments' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'environment' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an environment',
				description: 'Delete an environment from a project',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v1/projects/{{ $parameter.projectId }}/environments/{{ $parameter.environmentId }}',
					},
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'environment' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an environment',
				description: 'Retrieve a single environment by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v1/projects/{{ $parameter.projectId }}/environments/{{ $parameter.environmentId }}',
					},
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'environment' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an environment',
				description: 'Update an existing environment',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v1/projects/{{ $parameter.projectId }}/environments/{{ $parameter.environmentId }}',
					},
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'environment' } }] },
				},
			},
		],
		default: 'create',
	},

	projectIdPathField({ ...showForEnv, operation: ['create', 'get', 'update', 'delete'] }),

	{
		displayName: 'Environment ID',
		name: 'environmentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForEnv, operation: ['get', 'update', 'delete'] } },
		description: 'The ID of the environment',
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForEnv, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'The display name of the environment',
	},
	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. staging',
		displayOptions: { show: { ...showForEnv, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'slug', value: '={{ $value }}' } },
		description: 'A unique slug for the environment',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForEnv, operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
				description: 'The new display name of the environment',
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'slug', value: '={{ $value }}' } },
				description: 'The new slug of the environment',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 1,
				routing: { send: { type: 'body', property: 'position', value: '={{ $value }}' } },
				description: 'The ordering position of the environment',
			},
		],
	},
];
