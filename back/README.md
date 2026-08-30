# Portfolio API

Backend for the portfolio site: a contact form that stores messages in MongoDB
and notifies the site owner by email.

## Requirements

- Node.js 20.6+ (uses the native `--env-file` flag)
- MongoDB (Atlas or local)

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
```

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | yes | MongoDB connection string |
| `ADMIN_TOKEN` | yes | Bearer token for `GET /api/contact` |
| `PORT` | no | HTTP port (default `3201`) |
| `CORS_ORIGIN` | no | Allowed browser origin (default `http://localhost:5173`) |
| `TRUST_PROXY` | no | Proxy hop count when behind a reverse proxy |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` | no | SMTP transport; leave blank to disable notification emails |
| `CONTACT_TO` | no | Recipient for contact notifications (defaults to `SMTP_USER`) |

## Scripts

```bash
npm run dev        # watch mode (nodemon + tsx)
npm run build      # compile to dist/
npm start          # run the compiled build
npm run typecheck  # type-check without emitting
```

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | – | Liveness check |
| `POST` | `/api/contact` | – | Submit a contact message (rate-limited) |
| `GET` | `/api/contact` | `Authorization: Bearer <ADMIN_TOKEN>` | List messages (paginated: `?page`, `?limit`) |

## Project layout

```
src/
  config/      environment loading & validation
  db/          MongoDB connection lifecycle
  middleware/  auth, rate limiting, error handling
  models/      Mongoose schemas
  controllers/ request handlers
  routes/      route definitions
  services/    email delivery
  app.ts       express app assembly
  server.ts    startup, graceful shutdown
```
