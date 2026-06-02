import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

// Resolves the instance base URL from the selected region (or a custom/self-hosted URL).
// Shared by the credential test request and the node's requestDefaults.
export const resolvedBaseUrl =
	'={{$credentials.region === "custom" ? $credentials.customBaseUrl : $credentials.region}}';

export class InfisicalApi implements ICredentialType {
	name = 'infisicalApi';

	displayName = 'Infisical API';

	icon: Icon = 'file:../nodes/Infisical/infisical.svg';

	documentationUrl = 'https://infisical.com/docs/documentation/platform/identities/universal-auth';

	properties: INodeProperties[] = [
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'US Cloud (app.infisical.com)',
					value: 'https://app.infisical.com',
				},
				{
					name: 'EU Cloud (eu.infisical.com)',
					value: 'https://eu.infisical.com',
				},
				{
					name: 'Custom / Self-Hosted',
					value: 'custom',
				},
			],
			default: 'https://app.infisical.com',
			description: 'The Infisical instance to connect to',
		},
		{
			displayName: 'Custom Base URL',
			name: 'customBaseUrl',
			type: 'string',
			default: 'https://app.infisical.com',
			placeholder: 'https://infisical.your-domain.com',
			description: 'Base URL of your self-hosted Infisical instance, without a trailing slash',
			displayOptions: {
				show: {
					region: ['custom'],
				},
			},
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'The Client ID of the machine identity Universal Auth credential',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The Client Secret of the machine identity Universal Auth credential',
		},
		{
			// Populated at runtime by preAuthentication; never shown to the user.
			// `expirable: true` is REQUIRED — n8n only invokes preAuthentication when the
			// credential has a hidden property flagged expirable (see n8n CredentialsHelper).
			// Without it, the token exchange is skipped and requests are sent with an empty
			// Bearer token, which Infisical rejects with 403 "jwt must be provided".
			// `password: true` satisfies the @n8n/community-nodes/credential-password-field
			// lint rule (accessToken is a sensitive value); it coexists with expirable.
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'hidden',
			typeOptions: { expirable: true, password: true },
			default: '',
		},
	];

	// Exchange the Client ID/Secret for a short-lived access token (Universal Auth login).
	// n8n caches the result and re-runs this automatically when a request returns 401.
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const baseUrl = (
			credentials.region === 'custom' ? (credentials.customBaseUrl as string) : (credentials.region as string)
		).replace(/\/$/, '');

		const response = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}/api/v1/auth/universal-auth/login`,
			body: {
				clientId: credentials.clientId,
				clientSecret: credentials.clientSecret,
			},
			headers: { 'Content-Type': 'application/json' },
			json: true,
		})) as { accessToken: string };

		return { accessToken: response.accessToken };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: resolvedBaseUrl,
			url: '/api/v1/projects',
			method: 'GET',
		},
	};
}
