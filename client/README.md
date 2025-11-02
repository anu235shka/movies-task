# Favorite Movies & TV Shows - Fullstack App

## Tech stack
- Frontend: React + Vite + TypeScript + TailwindCSS + MUI
- Backend: Node.js + Express + TypeScript + Prisma (MySQL)
- Validation: Zod
- DB: MySQL

## Setup

### Backend
1. `cd backend`
2. Create `.env`:
      DATABASE_URL="mysql://user:password@localhost:3306/fav_media"
      PORT=4000
3. Install: `npm install`
4. Generate Prisma client: `npx prisma generate`
5. Run migrations: `npx prisma migrate dev --name init`
6. (Optional) Seed data: run `ts-node prisma/seed.ts` or build & run `node prisma/seed.js`
7. Start server (dev): `npx ts-node-dev --respawn src/index.ts`

APIs:
- `GET /api/entries?page=1&limit=20` — read (paginated)
- `POST /api/entries` — create
- `PUT /api/entries/:id` — update
- `DELETE /api/entries/:id` — delete

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env`:
    VITE_API_BASE=http://localhost:4000/api
4. Start dev server: `npm run dev`

## Deployment
- Frontend: Vercel / Netlify (build & point to dev URL). Use environment var `VITE_API_BASE`.
- Backend: Render / Railway / Heroku. Set DB env and run migrations in the deployment hooks.

## Notes & Improvements
- Consider cursor-based pagination for better performance at scale.
- Add authentication (JWT + users table) for per-user lists.
- Add images by storing uploads in cloud storage (S3) and save URL in `posterUrl`.
- Add search & filters on the backend (`title` contains, `director`, `type`).

