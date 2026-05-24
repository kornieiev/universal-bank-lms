# Universal Bank LMS

## Requirements

- Docker + Docker Compose
- Recommended Node.js `18+` / `npm` if you want to run services locally outside Docker
- For Docker mode, no manual `.env` setup is required (Compose uses committed `backend/.env.example` and `frontend/.env.example`).

## One-command startup

From the project root:

```bash
docker compose up
```

For the first launch after cloning (or after Dockerfile changes), use:

```bash
docker compose up --build
```

## After startup:

Frontend: http://localhost:3001
Backend API: http://localhost:5001

## Seeded test users

### All seeded users use the same password:

Password: Pass1234!

### Example accounts:

bohdan@example.com
taras@example.com
lesia@example.com
olena.koval@example.com
ivan.petrov@example.com
maria.shevchenko@example.com
sergiy.kravchenko@example.com
natalia.bilan@example.com
oleksandr.gordienko@example.com
tetyana.levchenko@example.com
viktor.semenov@example.com
anna.romanova@example.com
mykola.khmelnitsky@example.com


## API curl examples
1) Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"olena.koval@example.com","password":"Pass1234!"}'
```

2) Get courses
```bash
curl http://localhost:5001/api/courses \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

3) Enroll in a course
```bash
curl -X POST http://localhost:5001/api/courses/1/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{}'
```

4) Get leaderboard
```bash
curl http://localhost:5001/api/leaderboard \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Notes
- The project uses Docker Compose with three services: postgres, backend, and frontend.
- The backend is exposed on port 5001, and the frontend on port 3001.
- Backend startup automatically runs migrations and seed before launching the API server.
- No Postman/Insomnia collection is included currently, but the above curl examples cover the main auth and LMS flows.