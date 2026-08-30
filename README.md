# CBOS Customer Portal Next.js

Public customer information update portal for the CBOS Frontend API.

The form is based on `../frontend_swagger.json` and submits through these backend endpoints:

- `POST /auf-requests`
- `GET /auf-requests/{external_ref}`
- `PATCH /auf-requests/{external_ref}`
- `POST /auf-requests/{external_ref}/verify-account`
- `POST /auf-requests/{external_ref}/submit`
- `GET /master-data/countries`
- `GET /master-data/states`
- `GET /master-data/cities`
- `GET /master-data/banks`

## Backend

The app uses a Next.js API proxy at `/api/backend/*` to avoid browser CORS issues.

Default backend:

```bash
http://localhost:8099/api/frontend/v1
```

Override it with:

```bash
API_BASE_URL=http://localhost:8099/api/frontend/v1
```

## Run

```bash
npm install
npm run dev
```

Open:

```bash
http://127.0.0.1:3000
```

## Verify

```bash
npm run typecheck
npm run lint
npm run build
```
