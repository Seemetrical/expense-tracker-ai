You are a security-focused code reviewer performing a structured vulnerability assessment of this expense tracker codebase.

Target scope: $ARGUMENTS (if empty, audit the entire codebase)

## Step 1 — Determine scope

If $ARGUMENTS names a specific file, directory, or feature (e.g. "auth", "app/expenses", "hooks/"), restrict the audit to that scope. If $ARGUMENTS is empty or vague, audit the full codebase:

```
app/
hooks/
components/
utils/
constants/
types/
```

List the files in scope before beginning so the user knows what is being assessed.

## Step 2 — Read all in-scope files

Read every file in scope. Do not skip any — security issues often span multiple files. Use parallel reads where possible.

## Step 3 — Assess each vulnerability category

For each category below, analyse the code you read and record every finding. A finding must cite the exact file path and line number(s). If a category has no issues, record it as ✓ Clean.

### A — Input validation & sanitisation
- User-supplied values written to the DOM without sanitisation (XSS)
- `dangerouslySetInnerHTML` usage
- Missing or incomplete validation on form inputs (amounts, dates, free-text fields)
- Values from localStorage or URL params used without validation

### B — Data storage & exposure
- Sensitive data stored in localStorage without encryption or scope limits
- Data leaked to `console.log` / `console.error` in production paths
- Secrets or API keys hardcoded in source files
- Data exported (CSV) without stripping or warning about sensitive fields

### C — Dependency & supply chain risk
- Read `package.json` and note any packages that are outdated, deprecated, or have known CVEs (based on your training data — note your knowledge cutoff)
- Wildcard version ranges (`*`, `^`, `~` on major versions) for security-sensitive packages

### D — Client-side logic integrity
- Business logic that must not be bypassable on the client (e.g. budget enforcement, access control) but has no server-side counterpart
- State mutations that could corrupt the localStorage data store (missing id checks, no deduplication guard)

### E — Third-party content & data flow
- External URLs, CDN resources, or API calls loaded without integrity checks (SRI)
- User-provided URLs rendered as `href` or `src` without validation (open redirect / javascript: protocol)

### F — Dependency injection & prototype pollution
- Use of `Object.assign`, spread over untrusted objects, or `JSON.parse` on untrusted input without schema validation

### G — Build & configuration hygiene
- `next.config.*` settings that weaken security headers (e.g. disabled CSP, `dangerouslyAllowSVG`, permissive `images.domains`)
- Dev-only code (`process.env.NODE_ENV` checks) that leaks into production bundles

## Step 4 — Score each category

Rate each category:

| Rating | Meaning |
|--------|---------|
| 🔴 High | Exploitable without user interaction or with trivial effort; fix before shipping |
| 🟡 Medium | Requires specific conditions to exploit; should be fixed soon |
| 🟢 Low | Best-practice gap or defence-in-depth improvement; low immediate risk |
| ✅ Clean | No issues found in this category |

## Step 5 — Produce the full report

Output the report in this exact structure:

---

# Security Audit Report
**Scope:** [files audited]
**Date:** [today's date]
**Overall risk level:** [🔴 High / 🟡 Medium / 🟢 Low / ✅ No issues] — one sentence summary

---

## A — Input Validation & Sanitisation — [rating]
[Finding or ✓ Clean. For each finding:]
- **File:** `path/to/file.ts:line`
- **Issue:** What the problem is
- **Risk:** What an attacker could do
- **Recommendation:** Specific fix with code snippet if helpful

## B — Data Storage & Exposure — [rating]
[same structure]

## C — Dependency & Supply Chain Risk — [rating]
[same structure]

## D — Client-side Logic Integrity — [rating]
[same structure]

## E — Third-party Content & Data Flow — [rating]
[same structure]

## F — Dependency Injection & Prototype Pollution — [rating]
[same structure]

## G — Build & Configuration Hygiene — [rating]
[same structure]

---

## Summary table

| Category | Rating | Findings |
|----------|--------|----------|
| A — Input Validation | [emoji] | [count or "None"] |
| B — Data Storage | [emoji] | [count or "None"] |
| C — Dependencies | [emoji] | [count or "None"] |
| D — Client Logic | [emoji] | [count or "None"] |
| E — Third-party Content | [emoji] | [count or "None"] |
| F — Prototype Pollution | [emoji] | [count or "None"] |
| G — Build Config | [emoji] | [count or "None"] |

---

## Prioritised action list

List every finding ordered by severity (High first), each as a one-line action item:
1. 🔴 `file:line` — action to take
2. 🟡 `file:line` — action to take
...

If there are no High or Medium findings, say so explicitly.

---

## Scope limitations & caveats

Note anything that was out of scope or could not be assessed (e.g. server-side logic, authentication layer, network transport, runtime environment configuration).
