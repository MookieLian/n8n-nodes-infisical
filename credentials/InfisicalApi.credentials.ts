import type {
	IAuthenticate,
	Icon,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// Resolves the instance base URL from the selected region (or a custom/self-hosted URL).
// Shared by the credential test request and the node's requestDefaults.
export const resolvedBaseUrl =
	'={{$credentials.region === "custom" ? $credentials.customBaseUrl : $credentials.region}}';

// Refresh this long before the token's real expiry to avoid sending a token that expires in flight.
const TOKEN_EXPIRY_MARGIN_MS = 60_000;
// Used when the login response carries no usable `expiresIn`.
const DEFAULT_TOKEN_TTL_S = 60;

const tokenCache = new Map<string, { token: string; expiresAt: number }>();
const inflightLogins = new Map<string, Promise<string>>();

function getCredentialBaseUrl(credentials: ICredentialDataDecryptedObject): string {
	return (
		credentials.region === 'custom'
			? (credentials.customBaseUrl as string)
			: (credentials.region as string)
	).replace(/\/$/, '');
}

async function getAccessToken(credentials: ICredentialDataDecryptedObject): Promise<string> {
	const baseUrl = getCredentialBaseUrl(credentials);
	const clientId = credentials.clientId as string;
	const clientSecret = credentials.clientSecret as string;
	// The secret is part of the key so that rotating it takes effect immediately.
	const key = JSON.stringify([baseUrl, clientId, clientSecret]);

	const cached = tokenCache.get(key);
	if (cached && cached.expiresAt - TOKEN_EXPIRY_MARGIN_MS > Date.now()) return cached.token;

	let login = inflightLogins.get(key);
	if (!login) {
		login = (async () => {
			const response = await fetch(`${baseUrl}/api/v1/auth/universal-auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ clientId, clientSecret }),
			});
			if (!response.ok) {
				throw new Error(
					`Infisical Universal Auth login failed (HTTP ${response.status}): ${await response.text()}`,
				);
			}
			const data = (await response.json()) as { accessToken?: string; expiresIn?: number };
			if (!data.accessToken) throw new Error('Infisical login response contained no accessToken');
			const ttl = typeof data.expiresIn === 'number' && data.expiresIn > 0 ? data.expiresIn : DEFAULT_TOKEN_TTL_S;
			tokenCache.set(key, { token: data.accessToken, expiresAt: Date.now() + ttl * 1000 });
			return data.accessToken;
		})().finally(() => inflightLogins.delete(key));
		inflightLogins.set(key, login);
	}
	return await login;
}

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
	];

	// Exchange the Client ID/Secret for a short-lived access token (Universal Auth login)
	// on demand. The token is cached in memory (never persisted to the credential) together
	// with its expiry, and is re-requested shortly before it expires.
	//
	// Why not n8n's `expirable` + `preAuthentication` mechanism: n8n only re-runs
	// preAuthentication when a request fails with 401, but Infisical answers an expired access
	// token with 403 (TokenError), and the declarative routing used by this node cannot opt in to
	// retrying on 403. The cached token then stays stale until the credential is re-created.
	authenticate: IAuthenticate = async (credentials, requestOptions) => {
		const accessToken = await getAccessToken(credentials);
		requestOptions.headers = { ...requestOptions.headers, Authorization: `Bearer ${accessToken}` };
		return requestOptions;
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: resolvedBaseUrl,
			url: '/api/v1/projects',
			method: 'GET',
		},
	};
}
