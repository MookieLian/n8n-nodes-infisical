import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { infisicalApiRequest } from '../shared/transport';

type Environment = { id: string; name: string; slug: string };

export async function getEnvironments(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;

	if (!projectId) {
		return { results: [] };
	}

	const response = (await infisicalApiRequest.call(
		this,
		'GET',
		`/api/v1/projects/${projectId}`,
	)) as { project?: { environments?: Environment[] } };

	const environments = response.project?.environments ?? [];
	const lowerFilter = (filter ?? '').toLowerCase();

	const results: INodeListSearchItems[] = environments
		.filter((env) => !filter || env.name.toLowerCase().includes(lowerFilter))
		.map((env) => ({ name: `${env.name} (${env.slug})`, value: env.slug }));

	return { results };
}
