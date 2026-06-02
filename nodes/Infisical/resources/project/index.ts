import type {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { projectIdPathField } from '../../shared/descriptions';
import { infisicalApiRequest } from '../../shared/transport';

const showForProject = { resource: ['project'] };

// Infisical sets `hasDeleteProtection` to true on every project by default, and a
// DELETE against a protected project fails server-side with an HTTP 500. When the
// "Disable Delete Protection" option is enabled, turn protection off via PATCH
// immediately before the delete request is sent.
async function disableDeleteProtectionBeforeDelete(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const disable = this.getNodeParameter('disableDeleteProtection', true) as boolean;
	if (disable) {
		const projectId = this.getNodeParameter('projectId', undefined, {
			extractValue: true,
		}) as string;
		await infisicalApiRequest.call(
			this,
			'PATCH',
			`/api/v1/projects/${projectId}`,
			{},
			{ hasDeleteProtection: false },
		);
	}
	return requestOptions;
}

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
					send: { preSend: [disableDeleteProtectionBeforeDelete] },
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
		displayName: 'Disable Delete Protection',
		name: 'disableDeleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showForProject, operation: ['delete'] } },
		description:
			"Whether to automatically turn off the project's delete protection before deleting. Infisical enables delete protection on every project by default, and deletion fails with an HTTP 500 error while it is enabled. Disable this only if you have already turned protection off manually.",
	},

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
