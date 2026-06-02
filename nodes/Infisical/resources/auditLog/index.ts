import type { INodeProperties } from 'n8n-workflow';

const showForAuditLog = { resource: ['auditLog'] };

export const auditLogDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForAuditLog },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many audit logs',
				description: 'Retrieve organization audit logs',
				routing: {
					request: { method: 'GET', url: '/api/v1/organization/audit-logs' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'auditLogs' } }] },
				},
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...showForAuditLog, operation: ['getAll'] } },
		routing: {
			send: { paginate: '={{ $value }}' },
			operations: {
				pagination: {
					type: 'offset',
					properties: {
						limitParameter: 'limit',
						offsetParameter: 'offset',
						pageSize: 100,
						type: 'query',
					},
				},
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { ...showForAuditLog, operation: ['getAll'], returnAll: [false] } },
		routing: {
			send: { type: 'query', property: 'limit', value: '={{ $value }}' },
			output: { maxResults: '={{ $value }}' },
		},
		description: 'Max number of results to return',
	},

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...showForAuditLog, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Actor',
				name: 'actor',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'actor', value: '={{ $value }}' } },
				description: 'Filter logs by the actor that performed the action',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'endDate', value: '={{ $value }}' } },
				description: 'Only return logs before this date',
			},
			{
				displayName: 'Environment',
				name: 'environment',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'environment', value: '={{ $value }}' } },
				description: 'Filter logs to a specific environment slug',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'string',
				default: '',
				placeholder: 'e.g. get-secrets',
				routing: { send: { type: 'query', property: 'eventType', value: '={{ $value }}' } },
				description: 'Filter logs by event type',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'projectId', value: '={{ $value }}' } },
				description: 'Filter logs to a specific project',
			},
			{
				displayName: 'Secret Path',
				name: 'path',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'secretPath', value: '={{ $value }}' } },
				description: 'Filter logs by secret path',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				routing: { send: { type: 'query', property: 'startDate', value: '={{ $value }}' } },
				description: 'Only return logs after this date',
			},
		],
	},
];
