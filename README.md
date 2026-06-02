# n8n-nodes-infisical

This is an n8n community node. It lets you use [Infisical](https://infisical.com) — the open-source secrets, certificates and access management platform — in your n8n workflows.

It wraps the Infisical REST API directly (no SDK dependency) and supports managing secrets, folders, projects, environments, secret tags, secret imports, dynamic secrets, machine identities, and audit logs.

[n8n](https://n8n.io) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In n8n, go to **Settings > Community Nodes**, select **Install**, and enter:

```
@mookielianhd/n8n-nodes-infisical
```

## Operations

| Resource | Operations |
| --- | --- |
| **Secret** | Create, Get, Get Many, Update, Delete |
| **Folder** | Create, Get, Get Many, Update, Delete |
| **Project** | Create, Get, Get Many, Update, Delete |
| **Environment** | Create, Get, Update, Delete |
| **Secret Tag** | Create, Get, Get Many, Update, Delete |
| **Secret Import** | Create, Get, Get Many, Update, Delete |
| **Dynamic Secret** | Create, Get, Get Many, Update, Delete |
| **Identity** | Create, Get, Get Many, Update, Delete |
| **Audit Log** | Get Many |

## Credentials

This node authenticates with Infisical using **Universal Auth** (a machine identity Client ID and Client Secret). The node exchanges these for a short-lived access token automatically and refreshes it when it expires.

To set up credentials:

1. In Infisical, create a **Machine Identity** and attach the **Universal Auth** method to it (Organization Settings → Access Control → Identities). See the [Universal Auth docs](https://infisical.com/docs/documentation/platform/identities/universal-auth).
2. Add the identity to the project(s) you want to manage and grant it the required roles.
3. Copy the identity's **Client ID** and create a **Client Secret**.
4. In n8n, create new **Infisical API** credentials and fill in:
   - **Region** — `US Cloud`, `EU Cloud`, or `Custom / Self-Hosted` (with a **Custom Base URL** for self-hosted instances).
   - **Client ID** and **Client Secret**.
5. Click **Test** to verify the connection.

## Compatibility

Built and tested against n8n's current declarative node API (`n8nNodesApiVersion: 1`). Requires a recent version of n8n.

## Usage

- Most operations require selecting a **Project** (searchable list or manual ID) and an **Environment** (slug). Dynamic secrets use the project **slug** and environment slug instead.
- The **Secret → Get Many** operation returns decrypted secret values by default. Use the **View Secret Value** option to disable this. Be mindful of where secret values flow in your workflow.
- **Dynamic Secret → Create** takes a JSON **Provider** object whose shape depends on the provider type (e.g. `postgres`, `redis`, `aws-iam`). Refer to the Infisical dynamic secrets docs for the exact `inputs`.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Infisical API reference](https://infisical.com/docs/api-reference/overview/introduction)
- [Infisical Universal Auth](https://infisical.com/docs/documentation/platform/identities/universal-auth)

## License

[MIT](LICENSE.md)
