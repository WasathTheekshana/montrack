# Security Policy

## Supported versions

Only the latest version of Montrack is actively maintained.

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Send a description of the issue to **wasath_theekshana@next.co.uk** with the subject line `[SECURITY] Montrack`.

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix if you have one

You will receive a response within 72 hours. If the issue is confirmed, a fix will be prioritised and a patched release will be made as soon as possible.

## Scope

Montrack stores all data locally in the browser (`localStorage`). There is no server, no database, and no user accounts. The main security surface is the client-side application itself - XSS, insecure third-party scripts, and malicious backup file imports are the most relevant concerns.
