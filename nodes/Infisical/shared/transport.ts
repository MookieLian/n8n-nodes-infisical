import type {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

// Resolves the instance base URL from the credential's region/customBaseUrl pair.
export async function getBaseUrl(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('infisicalApi');
	const baseUrl = (
		credentials.region === 'custom'
			? (credentials.customBaseUrl as string)
			: (credentials.region as string)
	).replace(/\/$/, '');
	return baseUrl;
}

// Authenticated request helper for methods (listSearch / loadOptions) that run
// outside the declarative routing pipeline. Applies the credential auth flow.
export async function infisicalApiRequest(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
): Promise<IDataObject> {
	const baseUrl = await getBaseUrl.call(this);

	const options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: `${baseUrl}${resource}`,
		json: true,
	};

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'infisicalApi',
		options,
	)) as IDataObject;
}
