import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

import { secretDescription } from './resources/secret';
import { folderDescription } from './resources/folder';
import { projectDescription } from './resources/project';
import { environmentDescription } from './resources/environment';
import { secretTagDescription } from './resources/secretTag';
import { secretImportDescription } from './resources/secretImport';
import { dynamicSecretDescription } from './resources/dynamicSecret';
import { identityDescription } from './resources/identity';
import { auditLogDescription } from './resources/auditLog';

import { getProjects } from './listSearch/getProjects';
import { getEnvironments } from './listSearch/getEnvironments';

// Resolve the instance base URL from the selected region (or a custom/self-hosted URL).
const baseURL =
	'={{$credentials.region === "custom" ? $credentials.customBaseUrl : $credentials.region}}';

export class Infisical implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Infisical',
		name: 'infisical',
		icon: 'file:infisical.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage secrets and related resources in Infisical',
		defaults: {
			name: 'Infisical',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'infisicalApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL,
			headers: {
				Accept: 'application/json',
				// NOTE: Content-Type is intentionally NOT set here. n8n adds
				// `content-type: application/json` automatically for requests that carry a
				// body (create/update). Forcing it globally also attached it to bodyless
				// requests (e.g. DELETE), where Infisical's Fastify backend tries to parse an
				// empty JSON body and fails with a 500 "Something went wrong".
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Audit Log', value: 'auditLog' },
					{ name: 'Dynamic Secret', value: 'dynamicSecret' },
					{ name: 'Environment', value: 'environment' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Identity', value: 'identity' },
					{ name: 'Project', value: 'project' },
					{ name: 'Secret', value: 'secret' },
					{ name: 'Secret Import', value: 'secretImport' },
					{ name: 'Secret Tag', value: 'secretTag' },
				],
				default: 'secret',
			},
			...secretDescription,
			...folderDescription,
			...projectDescription,
			...environmentDescription,
			...secretTagDescription,
			...secretImportDescription,
			...dynamicSecretDescription,
			...identityDescription,
			...auditLogDescription,
		],
	};

	methods = {
		listSearch: {
			getProjects,
			getEnvironments,
		},
	};
}
