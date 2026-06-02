import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { infisicalApiRequest } from '../shared/transport';

type Project = { id: string; name: string; slug: string };

export async function getProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = (await infisicalApiRequest.call(this, 'GET', '/api/v1/projects')) as {
		projects?: Project[];
	};

	const projects = response.projects ?? [];
	const lowerFilter = (filter ?? '').toLowerCase();

	const results: INodeListSearchItems[] = projects
		.filter((project) => !filter || project.name.toLowerCase().includes(lowerFilter))
		.map((project) => ({ name: project.name, value: project.id }));

	return { results };
}
