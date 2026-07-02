# Student Success Hub — Internship Portal

A full-stack internship management platform: students apply, pay ₹79 via Razorpay,
complete 5 project-based tasks in Web Development or Data Analytics, get mentor
reviews, and receive a verified, QR-coded certificate. Includes a full admin panel.

```
student-success-hub/
├── backend/     Flask REST API + PostgreSQL (SQLAlchemy) + JWT auth
└── frontend/    React + Tailwind + React Router + Framer Motion
```

## What's implemented

- Full JWT auth for students and a separate admin role (register, login, refresh,
  forgot/reset password)
- Multi-step apply flow: student info → domain choice → Razorpay payment → success
- Razorpay order creation + **server-side signature verification** (HMAC-SHA256) —
  never trusts the client's "payment succeeded" claim alone
- Task catalog for both domains (5 tasks each), submission, mentor approve/reject
  with feedback, resubmission
- Certificate auto-generation (PDF via ReportLab + QR code) once all 5 tasks are
  approved, plus a public no-login "Verify Certificate" page
- Digital ID card with QR code
- Admin panel: dashboard stats, students, applications, task review queue,
  certificates, payments/revenue
- Transactional emails (welcome, offer letter, task decision, certificate ready,
  password reset) via Flask-Mail — logged and swallowed on failure so a broken
  SMTP config never breaks a student-facing request
- Rate limiting on auth/payment endpoints, password hashing, role-based route
  guards, CORS locked to your frontend origin

## What you must supply before this is truly "production"

These need **real credentials that only you can provide** — nothing here works
with placeholder values:

1. **Razorpay live keys** (`RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`) — get these
   from the Razorpay dashboard after KYC.
2. **SMTP credentials** for real email delivery (`MAIL_USERNAME` / `MAIL_PASSWORD`).
   Gmail App Passwords work for testing; use a transactional provider (SendGrid,
   Postmark, SES) for production volume.
3. **A Postgres database** — Render provisions one automatically if you use
   `render.yaml`, or point `DATABASE_URL` at any Postgres instance.
4. Update tutorial/dataset URLs in `backend/app/models/task.py` — they're
   placeholders right now.

## Local development

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in real values
flask db init && flask db migrate -m "initial" && flask db upgrade
python seed_admin.py    # creates your first admin login
python run.py            # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api to :5000)
```

## Deploying to Render

1. Push this repo to GitHub.
2. In Render, "New +" → "Blueprint" → point at `backend/render.yaml`. This
   provisions the web service and a managed Postgres database together.
3. Fill in the `sync: false` environment variables in the Render dashboard
   (Razorpay keys, SMTP, `FRONTEND_URL`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`).
4. Deploy the `frontend/` folder as a separate Render Static Site
   (build command `npm run build`, publish directory `dist`), and set its
   `VITE`-time API base or the dev proxy target to your backend's Render URL.
5. After the first backend deploy, run `python seed_admin.py` once (Render
   Shell) to create your admin login.

## Notes on scope

This is a complete, coherent scaffold with working business logic end-to-end —
not a UI mockup. What it deliberately does **not** do: file uploads for resumes/
photos (URLs are stored as text — wire up S3/Cloudinary if you want real uploads),
a full admin CRUD UI for editing task content, or automated Alembic migration
files (run `flask db migrate` locally once your models are final). Razorpay and
email are fully wired in code but obviously untested against your real
credentials, since I don't have access to fabricate working ones for you.
