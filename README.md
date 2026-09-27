I inspected the actual `gilasartirac-svg/glsArt` repository, especially `frontend/src/app.js`, `worker/src/index.js`, the D1 migrations, and `docs/SECURITY.md`. The authentication is **OTP-based, session-cookie-based authentication**, not JWT.

## 1. Architecture

The authentication components are:

```text
Browser / GitHub Pages
        │
        │ HTTPS + fetch(credentials:"include")
        ▼
Cloudflare Worker
        │
        ├── OTP generation/verification
        ├── Session validation
        ├── CSRF validation
        ├── RBAC / permissions
        └── API authorization
        │
        ▼
Cloudflare D1
        ├── users
        ├── otp_challenges
        ├── sessions
        ├── roles / user_roles
        ├── admin_roles
        ├── admin_users
        ├── permissions
        └── audit_logs

Worker ───────► Kavenegar
                 SMS OTP
```

The frontend deliberately does **not** authenticate directly against D1 or Kavenegar. Everything sensitive goes through the Worker.

---

# 2. Login starts in the frontend

The main account page in `frontend/src/app.js` asks for a mobile number.

The important call is essentially:

```js
await api('/api/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({
        mobile: document.querySelector('#mobile').value
    })
});
```

The common `api()` function uses:

```js
fetch(API + path, {
    credentials: 'include',
    cache: 'no-store',
    headers,
    ...opt
});
```

That `credentials: 'include'` is important.

It tells the browser to send/receive cookies with requests to the Worker.

So the frontend **does not store a bearer token and attach**

```http
Authorization: Bearer ...
```

Instead, authentication is primarily represented by an HTTP-only session cookie.

---

# 3. Step 1 — Request OTP

The browser sends:

```http
POST /api/auth/request-otp
Content-Type: application/json

{
  "mobile": "09123456789"
}
```

The Worker:

### Validates the number

```js
if (!/^09\d{9}$/.test(mobile))
    return json({error:'invalid_mobile'},400);
```

### Applies rate limits

There are separate limits for:

```text
mobile
IP address
```

The code currently calls:

```js
rate(env, mobile, 3, 10)
rate(env, ip, 12, 10)
```

So the authentication endpoint is not simply:

> "send unlimited OTPs."

It has both mobile and IP throttling.

---

# 4. OTP generation

The Worker generates the six-digit OTP using Web Crypto:

```js
const raw = new Uint32Array(1);
crypto.getRandomValues(raw);

const code = String(
    100000 + (raw[0] % 900000)
);
```

The important security property is that it isn't using something predictable like:

```js
Math.random()
```

It uses:

```js
crypto.getRandomValues()
```

---

# 5. The OTP itself is NOT stored in D1

This is an important part of the design.

The Worker calculates:

```js
sha(`${env.OTP_PEPPER || 'gilasart'}:${code}`)
```

and stores the resulting hash in:

```text
otp_challenges.code_hash
```

rather than storing the plaintext OTP.

The database record also contains things such as:

```text
challenge ID
mobile
code_hash
expires_at
request_ip
attempts
consumed_at
```

The documented security policy says OTPs expire after **2 minutes** and are limited to **5 verification attempts**.

So conceptually:

```text
OTP = 583921

             SHA-256 + pepper
                    │
                    ▼
              code_hash
                    │
                    ▼
                  D1
```

The plaintext OTP is sent to the customer through Kavenegar but isn't intended to be persisted as plaintext.

---

# 6. Kavenegar credential

The Worker uses:

```js
env.KAVENEGAR_API_KEY
```

to call Kavenegar.

That credential is **not in the frontend JavaScript**.

The deployment documentation identifies it as a **Worker secret**:

```text
KAVENEGAR_API_KEY
```

Likewise:

```text
OTP_PEPPER
ZARINPAL_MERCHANT_ID
```

are intended to be secrets rather than frontend configuration.

This is the correct architectural boundary:

```text
Browser
   │
   │ mobile number
   ▼
Worker
   │
   │ KAVENEGAR_API_KEY
   ▼
Kavenegar
```

not:

```text
Browser
   │
   └── KAVENEGAR_API_KEY ❌
```

---

# 7. Step 2 — Verify OTP

After receiving the SMS, the frontend sends:

```http
POST /api/auth/verify-otp

{
  "challengeId": "...",
  "code": "583921"
}
```

The Worker first finds the challenge:

```js
SELECT *
FROM otp_challenges
WHERE id=?
  AND consumed_at IS NULL
  AND unixepoch(expires_at)>unixepoch('now')
```

It also checks:

```js
c.attempts >= 5
```

Then it hashes the submitted OTP:

```js
sha(`${env.OTP_PEPPER || 'gilasart'}:${String(b.code || '')}`)
```

and compares it with:

```text
c.code_hash
```

So the Worker never needs to retrieve a plaintext OTP from the database.

---

# 8. User creation

After successful verification:

```js
SELECT id,mobile,name
FROM users
WHERE mobile=?
```

If the user doesn't exist:

```js
INSERT INTO users(id,mobile)
VALUES(?,?)
```

So the mobile number acts as the identity for the customer authentication system.

There isn't a conventional:

```text
username + password
```

system here.

---

# 9. The actual authentication token is a session ID

This is the most important distinction.

After successful OTP verification:

```js
const sid = uid();
```

Then:

```js
INSERT INTO sessions(
    id,
    user_id,
    expires_at
)
VALUES(
    ?,
    ?,
    datetime('now','+30 days')
)
```

So the Worker generates a random session identifier and stores the session server-side in D1.

The browser receives:

```http
Set-Cookie:
__Host-gs_session=<session-id>;
Path=/;
HttpOnly;
Secure;
SameSite=None;
Max-Age=2592000
```

Therefore the authentication model is:

```text
                  D1
             ┌─────────────┐
             │ sessions    │
             │             │
             │ id ─────────┼──► user_id
             │ expires_at  │
             │ revoked_at  │
             └─────────────┘
                    ▲
                    │
              session ID
                    │
Browser ───── Cookie┘
```

This is **opaque server-side session authentication**.

It is not JWT.

---

# 10. What does the browser actually possess?

The browser gets two cookies.

### Authentication cookie

```text
__Host-gs_session
```

with:

```text
HttpOnly
Secure
Path=/
```

This is the actual authentication credential.

Because it is `HttpOnly`, normal JavaScript cannot read it using:

```js
document.cookie
```

That's desirable for reducing token theft through XSS.

### CSRF cookie

The Worker also creates:

```text
gs_csrf
```

This is intentionally accessible to JavaScript.

The frontend receives the CSRF token from the login response:

```js
csrfToken = v.csrfToken || csrfToken;
```

and later sends it as:

```http
X-CSRF-Token: ...
```

---

# 11. Why are there two tokens?

Because they serve different purposes.

### Session cookie

Answers:

> "Who is this user?"

```text
__Host-gs_session
```

### CSRF token

Answers:

> "Did this state-changing request originate from the legitimate application?"

```text
gs_csrf
```

The Worker checks:

```js
function requireCsrf(req) {
    return req.headers.get('X-CSRF-Token')
        &&
        req.headers.get('X-CSRF-Token')
        === cookies(req)['gs_csrf'];
}
```

So an authenticated mutation normally requires both:

```text
valid session cookie
+
valid CSRF header
```

---

# 12. Every authenticated request re-validates the session

The Worker has:

```js
async function user(req, env) {
    const sid = cookies(req)['__Host-gs_session'];

    if (!sid) return null;

    return env.DB.prepare(`
        SELECT u.id,u.mobile,u.name
        FROM sessions s
        JOIN users u ON u.id=s.user_id
        WHERE s.id=?
          AND s.revoked_at IS NULL
          AND unixepoch(s.expires_at)>unixepoch('now')
    `).bind(sid).first();
}
```

This is important.

The Worker doesn't simply trust:

```text
"the browser has a cookie"
```

It checks D1.

It requires:

```text
session exists
AND
session isn't revoked
AND
session hasn't expired
```

Then it joins the session to the corresponding user.

---

# 13. `/api/me` reconstructs the logged-in state

The frontend calls:

```js
api('/api/me')
```

The Worker returns:

```js
{
    user: u0,
    roles: await roles(u0, env),
    csrfToken
}
```

The frontend then stores the user information in runtime memory:

```js
state.user = d.user;
state.roles = d.roles || [];
csrfToken = d.csrfToken || csrfToken;
```

Notice that the frontend does **not** persist the session ID in:

```text
localStorage
sessionStorage
```

The session remains in the browser's cookie jar.

---

# 14. Logout

Logout is:

```http
POST /api/auth/logout
X-CSRF-Token: ...
Cookie: __Host-gs_session=...
```

The Worker first checks CSRF:

```js
if (!requireCsrf(req))
    return json({error:'forbidden'},403);
```

Then:

```js
UPDATE sessions
SET revoked_at=datetime('now')
WHERE id=?
```

And it expires both cookies.

So logout isn't merely:

```js
localStorage.removeItem(...)
```

It actually invalidates the server-side session.

---

# 15. Admin authentication is a separate authorization layer

This is where the repository gets more interesting.

Authentication and authorization are separate.

Authentication establishes:

```text
This is user X.
```

Authorization establishes:

```text
What is user X allowed to do?
```

The Worker retrieves roles from both:

```text
legacy roles
+
enterprise admin roles
```

The code does:

```js
SELECT r.name
FROM roles r
JOIN user_roles ur ON ur.role_id=r.id
WHERE ur.user_id=?
```

and:

```js
SELECT ar.name
FROM admin_roles ar
JOIN admin_users au
    ON au.role_id=ar.id
WHERE au.user_id=?
  AND au.active=1
```

The two sets are combined.

---

# 16. Permissions are database-driven

The enterprise authorization model uses:

```text
admin_users
     │
     ▼
admin_roles
     │
     ▼
role_permissions
     │
     ▼
permissions
```

For example:

```text
admin
 │
 ├── products.read
 ├── products.write
 ├── orders.read
 ├── orders.write
 ├── customers.read
 ├── payments.read
 ├── reports.read
 ├── settings.write
 └── ...
```

The Worker resolves those permissions from D1:

```js
SELECT DISTINCT p.name
FROM permissions p
JOIN role_permissions rp
    ON rp.permission_id=p.id
JOIN admin_roles ar
    ON ar.id=rp.role_id
JOIN admin_users au
    ON au.role_id=ar.id
WHERE au.user_id=?
  AND au.active=1
```

Then:

```js
requirePermission(me, env, 'orders.write')
```

determines whether the operation is permitted.

---

# 17. There is currently an important admin-specific restriction

The repository's current Worker contains:

```js
if (
    u.pathname.startsWith('/api/admin')
    && me?.mobile !== '09153090907'
)
    return json({error:'forbidden'},403);
```

And the frontend contains:

```js
function isAdminUser() {
    return state.user?.mobile === "09153090907";
}
```

So **currently the admin panel is still hard-coded around that mobile number**.

The repository also has the more general D1 RBAC infrastructure:

```text
admin_users
admin_roles
role_permissions
permissions
```

but the `/api/admin` entry gate still contains the explicit mobile-number check.

That means the system is **not yet purely RBAC-controlled at the top-level admin boundary**.

That's something I would specifically flag for production hardening.

---

# 18. Complete request flow

Putting everything together:

```text
USER
 │
 │ 1. Enter mobile
 ▼
GitHub Pages frontend
 │
 │ POST /api/auth/request-otp
 ▼
Cloudflare Worker
 │
 ├── validate mobile
 ├── rate-limit mobile
 ├── rate-limit IP
 ├── crypto.getRandomValues()
 │
 ├── OTP
 │     │
 │     └── SHA256(OTP_PEPPER + OTP)
 │                │
 │                ▼
 │               D1
 │
 └── Kavenegar
        │
        ▼
       SMS
        │
        ▼
      USER
        │
        │ enters OTP
        ▼
Frontend
        │
        │ POST /api/auth/verify-otp
        ▼
Worker
        │
        ├── load challenge
        ├── check expiry
        ├── check attempts
        ├── hash supplied OTP
        ├── compare hash
        │
        ├── find/create user
        │
        ├── generate session ID
        │
        ├── store session in D1
        │
        └── Set-Cookie
              │
              ├── __Host-gs_session
              └── gs_csrf
```

After that:

```text
Browser
   │
   │ Cookie: __Host-gs_session
   │ X-CSRF-Token: ...
   ▼
Cloudflare Worker
   │
   ├── lookup session in D1
   ├── verify not expired
   ├── verify not revoked
   ├── identify user
   ├── resolve roles
   ├── resolve permissions
   ├── check authorization
   ▼
D1 / protected operation
```

---

## 19. Where credentials live

| Credential / token   | Location                                    | Exposed to JS?              |
| -------------------- | ------------------------------------------- | --------------------------- |
| Kavenegar API key    | Worker secret                               | **No**                      |
| OTP pepper           | Worker secret                               | **No**                      |
| ZarinPal merchant ID | Worker secret                               | **No**                      |
| OTP plaintext        | Kavenegar request / transient Worker memory | Not persisted intentionally |
| OTP hash             | D1                                          | No                          |
| Session ID           | D1 + HttpOnly browser cookie                | **No, not to JS**           |
| CSRF token           | Browser cookie + frontend runtime           | Yes                         |
| User identity        | D1 + frontend runtime state                 | Yes                         |
| Roles                | D1 → `/api/me` response                     | Yes                         |
| Permissions          | D1 → admin API                              | Yes                         |

The deployment documentation explicitly separates Worker variables from Worker secrets, including `KAVENEGAR_API_KEY`, `OTP_PEPPER`, and `ZARINPAL_MERCHANT_ID`. [Deployment documentation](https://github.com/gilasartirac-svg/glsArt/blob/main/docs/DEPLOYMENT.md?utm_source=chatgpt.com)

The repository's security documentation also explicitly describes OTP hashing, expiry/attempt limits, HttpOnly/Secure sessions, CSRF protection, restricted CORS, and server-side payment verification. [Security documentation](https://github.com/gilasartirac-svg/glsArt/blob/main/docs/SECURITY.md?utm_source=chatgpt.com)

### Bottom line

The repo's authentication is:

**SMS OTP → hashed OTP challenge → D1-backed opaque session → HttpOnly/Secure cookie → CSRF token for mutations → D1-based roles/permissions for authorization.**

There is **no JWT authentication mechanism in the active flow** that I found.

One security issue worth addressing before calling the admin authentication fully production-grade is the hard-coded `09153090907` admin gate: the repository has RBAC tables and permission checks, but the top-level `/api/admin` protection still depends on that mobile number.

