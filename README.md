# kraken-devfoundry

## DevFoundry MVP (In Progress)

This repository now includes the first implementation slice of a coding-learning platform with:

- Frontend: React + TypeScript + Tailwind + Monaco editor workspace
- Backend: .NET 10 Minimal API + EF Core + PostgreSQL-ready infrastructure
- Architecture: Clean boundaries across Domain, Application, Infrastructure, and API

## Repository Structure

- `frontend/`
	- `src/components/`: topbar, sidebar, explorer, action bar, instruction panel, status console
	- `src/features/course/`: lesson workspace composition
	- `src/layouts/`: learning shell layout
	- `src/hooks/`: lesson state and interactions
	- `src/services/`: MVP mock service calls (run, progress, hints)
- `backend/src/`
	- `DevFoundry.Domain/`: learning entities and future org-ready entities
	- `DevFoundry.Application/`: DTOs and service contracts
	- `DevFoundry.Infrastructure/`: EF Core DbContext, seed data, service implementations, DI
	- `DevFoundry.API/`: required endpoint set

## MVP Endpoints Implemented

- `GET /courses`
- `GET /lessons/{id}`
- `POST /progress`
- `POST /code/run`
- `POST /ai/hint`

Code execution is intentionally mock-based through an adapter service and does not execute raw user code inside the API process.

## Local Run

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional API mode:

```bash
# frontend/.env.local
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:5117
```

### Backend

```bash
cd backend/src/DevFoundry.API
dotnet run
```

The backend uses the connection string in `backend/src/DevFoundry.API/appsettings.json`.
Development mode defaults to in-memory persistence (`UseInMemoryDatabase=true` in development settings) so endpoints can run without local PostgreSQL.

## Current Scope Notes

- Single mock learner flow is implemented.
- One seeded JavaScript learning path is included for MVP behavior.
- Authentication, real sandbox runtime, and advanced organization workflows are intentionally deferred.