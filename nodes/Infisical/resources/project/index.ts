import type { INodeProperties } from 'n8n-workflow';
import { projectIdPathField } from '../../shared/descriptions';

const showForProject = { resource: ['project'] };

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForProject },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project',
				description: 'Create a new project',
				routing: {
					request: { method: 'POST', url: '/api/v1/projects' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'project' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a project',
				description: 'Delete a project',
				routing: {
					request: { method: 'DELETE', url: '=/api/v1/projects/{{ $parameter.projectId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'project' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Retrieve a single project by ID',
				routing: {
					request: { method: 'GET', url: '=/api/v1/projects/{{ $parameter.projectId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'project' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				description: 'List the projects the identity can access',
				routing: {
					request: { method: 'GET', url: '/api/v1/projects' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'projects' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project',
				description: 'Update an existing project',
				routing: {
					request: { method: 'PATCH', url: '=/api/v1/projects/{{ $parameter.projectId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'project' } }] },
				},
			},
		],
		default: 'getAll',
	},

	projectIdPathField({ ...showForProject, operation: ['get', 'update', 'delete'] }),

	{
		displayName: 'Project Name',
		name: 'projectName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForProject, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'projectName', value: '={{ $value }}' } },
		description: 'The name of the project',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForProject, operation: ['create'] } },
		options: [
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'slug', value: '={{ $value }}' } },
				description: 'A unique slug for the project',
			},
			{
				displayName: 'Description',
				name: 'projectDescription',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'projectDescription', value: '={{ $value }}' } },
				description: 'An optional description of the project',
			},
			{
				displayName: 'Create Default Environments',
				name: 'shouldCreateDefaultEnvs',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'body', property: 'shouldCreateDefaultEnvs', value: '={{ $value }}' } },
				description: 'Whether to create the default dev/staging/prod environments',
			},
			{
				displayName: 'Has Delete Protection',
				name: 'hasDeleteProtection',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'hasDeleteProtection', value: '={{ $value }}' } },
				description: 'Whether deletion protection is enabled for the project',
			},
		],
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForProject, operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
				description: 'The new name of the project',
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'slug', value: '={{ $value }}' } },
				description: 'The new slug of the project',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'description', value: '={{ $value }}' } },
				description: 'The new description of the project',
			},
			{
				displayName: 'Has Delete Protection',
				name: 'hasDeleteProtection',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'hasDeleteProtection', value: '={{ $value }}' } },
				description: 'Whether deletion protection is enabled for the project',
			},
		],
	},
];
