# Security Policy

## Scope

**api-coac** is a zero-dependency static JSON API hosted on GitHub Pages. It serves only public domain historical data about COAC (Concurso Oficial de Agrupaciones Carnavalescas de Cádiz). There is no backend, no authentication, no database, and no personal data processed.

In-scope for vulnerability reports:
- Cross-site scripting (XSS) via injected data in JSON files
- Supply chain attacks via CDN dependencies
- Misconfigured GitHub Actions permissions
- Sensitive information accidentally committed to the repository

Out of scope:
- Denial of service (GitHub Pages infrastructure handles this)
- Rate limiting (no API keys or private endpoints exist)
- Social engineering

## Supported Versions

Only the latest commit on the `main` branch is actively maintained.

| Branch | Supported |
|--------|-----------|
| `main` | Yes       |
| Others | No        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Use one of these channels:

1. **GitHub Private Vulnerability Reporting** (preferred):
   Go to the [Security tab](../../security/advisories/new) of this repository and open a private advisory.

2. **Email**: Send a description to `basma.dali.web@gmail.com` with subject `[SECURITY] api-coac`.

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

## Response Timeline

| Stage | Target |
|-------|--------|
| Acknowledgement | 48 hours |
| Initial assessment | 5 business days |
| Fix or mitigation | 14 days for medium/high severity |

## Data & Privacy

All data served by this API is public domain historical information. No personal data, credentials, or private information is processed or stored. This project is fully compliant with applicable open data principles.

## License

This project is released under the [MIT License](LICENSE).
