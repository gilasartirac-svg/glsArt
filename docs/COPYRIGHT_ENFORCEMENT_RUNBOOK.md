# GilasArt Copyright Enforcement Runbook

**Audience:** GilasArt site owner / authorized site administrator  
**Purpose:** A repeatable, evidence-preserving process for responding to suspected unauthorized copying of GilasArt's original code, artwork photographs, product descriptions, branding, and other protected materials.

> This operational guide is not legal advice. Copyright ownership, exceptions, notice requirements, and remedies depend on the applicable law and the facts. Obtain legal advice for disputed or high-impact cases.

## 1. Before making a claim

1. Identify the exact work and confirm that GilasArt or the relevant rights holder owns it or is authorized to enforce its rights.
2. Distinguish original material from third-party material, licensed assets, open-source components, and customer-submitted content.
3. Record the relevant original source: repository path and commit, original artwork file, publication date if known, product code, and any contract or license supporting ownership.
4. Do not claim ownership of third-party/open-source materials beyond the rights actually held.

## 2. Preserve evidence

For each suspected infringement, create a restricted case folder and record:

- Date/time observed (including time zone).
- Exact page URL(s) and the suspected infringing material.
- Screenshot(s) showing the URL and relevant content; save a PDF or page capture where lawful and practical.
- Original GilasArt URL, repository path/commit or original image file, and a checksum when available.
- Side-by-side comparison and a short factual explanation of the similarities.
- Relevant correspondence, platform ticket numbers, and responses.

Keep unedited originals and a separate working copy. Do not publish private customer data, credentials, internal security details, or personal contact details in public complaints.

## 3. Respond proportionately

1. First determine whether the use may be licensed, permitted, public-domain, fair use/fair dealing, or otherwise lawful.
2. If appropriate, send a professional request identifying the specific work, the exact location of the use, the rights holder/authorized representative, and the requested remedy.
3. For a platform-hosted copy, use that platform's official copyright/IP reporting process and provide only truthful, complete information required by the form.
4. For a domain or hosting complaint, follow the provider's official process. A takedown request is a legal assertion; do not submit it unless authorized and reasonably supported.
5. Escalate disputed ownership, counter-notices, repeat commercial copying, or material financial harm to qualified legal counsel.

## 4. Repository and code-copying cases

- Capture the source repository URL, affected file paths, commit IDs, license/notice files, and the allegedly copied public locations.
- Check whether the material includes open-source or third-party code and follow the applicable license obligations.
- Do not expose secrets or private user information while preparing evidence.
- Report copied code through the host's official IP process. Do not use access attempts, threats, or automated retaliation against the other party.

## 5. Prevention checklist

- Keep this policy and the proprietary notice accurate; update the year and rights-holder details when appropriate.
- Keep API keys, OTP credentials, payment secrets, customer records, and private business logic out of public files and Git history.
- Review repository visibility, collaborators, GitHub Actions permissions, deployment credentials, and secret-scanning alerts.
- Consider keeping confidential source in a private repository and publishing only the deployment artifacts required by the production pipeline—but first verify Pages/Cloudflare deployment dependencies and test a rollback plan.
- Treat `robots.txt` and AI crawler instructions as voluntary signals, not access control.
- Keep dated originals and a simple inventory of artwork and other original assets.

## 6. Close-out record

For every case, record the decision, the person who approved it, actions taken, dates, platform/reference numbers, outcome, and any follow-up. Restrict the case folder to authorized personnel and apply an appropriate retention period.

## Important technical limitation

A copyright notice, repository policy, watermark, or crawler directive does not technically prevent copying of publicly accessible material. Access control requires restricting the source itself and carefully separating private source code from public production assets. Existing public forks, clones, caches, and previously downloaded copies may remain after a repository is made private.
