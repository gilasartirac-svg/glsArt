# GilasArt — AI Analysis, Crawling, and Reuse Policy

**Effective date:** 2026-10-14  
**Website:** https://gilasart.ir  
**Related notice:** [Proprietary Software and Intellectual Property Notice](./PROPRIETARY_NOTICE.md)

## Policy

Unless expressly authorized by the applicable rights holder or otherwise permitted by law or an applicable third-party license, users and automated systems must not use proprietary GilasArt materials obtained from this repository or website to:

- reproduce or redistribute proprietary source code;
- build or commercially operate a copy or derivative of proprietary GilasArt software;
- extract, republish, or commercially exploit proprietary business rules, documentation, or original design materials;
- use automated collection to evade access controls, overload services, or obtain non-public information;
- expose, infer, or attempt to obtain credentials, private customer data, order data, or other confidential information.

Use of public files by AI systems is not technically blocked by this policy. This document communicates the project's intended restrictions; it is not an authentication system and does not guarantee that an AI model, crawler, search engine, or third party will comply.

## Technical boundaries

1. Public repository files can be read and copied by visitors. A policy file, prompt, or robots.txt entry cannot force an AI system to return an error or prevent direct GitHub access.
2. robots.txt is a voluntary crawler convention, not a security boundary. Do not put secrets or private URLs in it.
3. Keep credentials in GitHub Actions secrets or Cloudflare secret bindings, never in source files, frontend bundles, public snapshots, issue comments, or logs.
4. Keep authorization, price validation, inventory decisions, payment verification, and private customer/order data server-side. Public frontend code must not be treated as confidential.
5. Apply least privilege to GitHub, Cloudflare, deployment tokens, D1 access, and administrative accounts.
6. If source code needs confidentiality, move the relevant components to a private repository or private service after reviewing deployment dependencies. Do not change repository visibility or deployment settings without a tested migration plan.
7. Do not rely on obfuscation, prompt instructions, or crawler blocking as substitutes for access control.
8. If a credential is found in Git history, revoke or rotate it first; removing the current file alone is insufficient.

## Responsible handling

Do not test defenses by disrupting production, probing other people's systems, or accessing private data. Security testing must be authorized and non-destructive.

## Review checklist before enforcement

- Confirm which code and artwork GilasArt owns and which components are third-party.
- Review the full Git history and release artifacts for accidentally committed secrets.
- Review repository collaborators, GitHub Actions permissions, deployment secrets, Cloudflare access, and D1 permissions.
- Review public snapshots and built frontend assets for private data.
- Decide whether any proprietary source should be moved to a private repository.
- Have the rights holder review this policy for the jurisdictions in which the business operates.

This policy document alone does not change application behavior or block analysis of public repository contents.
