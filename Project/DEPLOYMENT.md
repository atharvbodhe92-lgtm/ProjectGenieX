# Deployment and Verification

## Environment

Create environment files from the templates:

- `Backend/.env.example` -> `Backend/.env`
- `Frontend/.env.example` -> `Frontend/.env`

Required backend values:

- `GOOGLE_GEMINI_KEY_1`
- `SCRAPINGDOG_API_KEY`
- `CORS_ORIGIN`

Firebase is the selected application data store. MongoDB is optional and only used if `MONGODB_URI` is configured.

## Local Run

Backend:

```bash
cd Backend
npm run dev
```

Frontend:

```bash
cd Frontend
npm run dev
```

Default URLs:

- Frontend: `http://localhost:8000`
- Backend: `http://localhost:3000`

## Verification

Backend smoke test:

```bash
cd Backend
npm run smoke
```

Frontend checks:

```bash
cd Frontend
npm run verify
```

## Production Notes

- Set `CORS_ORIGIN` to the deployed frontend URL.
- Keep Gemini and research-paper API keys only in backend environment variables.
- Configure Firebase Auth authorized domains and Firestore security rules before public deployment.
- Tune `RATE_LIMIT_MAX_REQUESTS`, `PAPER_SESSION_TTL_MS`, and `MAX_PAPER_SESSIONS` for expected usage.
