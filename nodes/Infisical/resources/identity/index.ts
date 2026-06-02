import type { INodeProperties } from 'n8n-workflow';

const showForIdentity = { resource: ['identity'] };

export const identityDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForIdentity },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an identity',
				description: 'Create a new machine identity',
				routing: {
					request: { method: 'POST', url: '/api/v1/identities' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'identity' } }] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an identity',
				description: 'Delete a machine identity',
				routing: {
					request: { method: 'DELETE', url: '=/api/v1/identities/{{ $parameter.identityId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'identity' } }] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an identity',
				description: 'Retrieve a single machine identity by ID',
				routing: {
					request: { method: 'GET', url: '=/api/v1/identities/{{ $parameter.identityId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'identity' } }] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many identities',
				description: 'List machine identities in an organization',
				routing: {
					request: { method: 'GET', url: '/api/v1/identities' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'identities' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an identity',
				description: 'Update an existing machine identity',
				routing: {
					request: { method: 'PATCH', url: '=/api/v1/identities/{{ $parameter.identityId }}' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'identity' } }] },
				},
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Identity ID',
		name: 'identityId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForIdentity, operation: ['get', 'update', 'delete'] } },
		description: 'The ID of the machine identity',
	},

	{
		displayName: 'Organization ID',
		name: 'orgId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForIdentity, operation: ['getAll'] } },
		routing: { send: { type: 'query', property: 'orgId', value: '={{ $value }}' } },
		description: 'The ID of the organization to list identities from',
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForIdentity, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'The name of the machine identity',
	},
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showForIdentity, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'organizationId', value: '={{ $value }}' } },
		description: 'The ID of the organization the identity belongs to',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForIdentity, operation: ['create'] } },
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				default: 'no-access',
				routing: { send: { type: 'body', property: 'role', value: '={{ $value }}' } },
				description: 'The organization role slug to assign to the identity',
			},
			{
				displayName: 'Has Delete Protection',
				name: 'hasDeleteProtection',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'hasDeleteProtection', value: '={{ $value }}' } },
				description: 'Whether deletion protection is enabled for the identity',
			},
		],
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...showForIdentity, operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
				description: 'The new name of the identity',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'role', value: '={{ $value }}' } },
				description: 'The new organization role slug',
			},
			{
				displayName: 'Has Delete Protection',
				name: 'hasDeleteProtection',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'hasDeleteProtection', value: '={{ $value }}' } },
				description: 'Whether deletion protection is enabled for the identity',
			},
		],
	},
];
