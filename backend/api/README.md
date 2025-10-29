# API Module Structure

The `api/` directory centralises the Express routing configuration that powers the testing-features branch. It exposes an in-memory implementation for listings and reservations so the frontend can be developed without a database dependency.

## Contents

- `index.js` mounts every API route behind the `/api` prefix.
- `routes/` defines feature routers. Existing auth, business, user, and upload routes are wrapped alongside new listings and reservations routers.
- `controllers/` exposes lightweight controllers with in-memory stores—ideal for testing and future replacement with database logic.
- `data/store.js` provides shared mock data and helper utilities for generating IDs.

## Next steps

- Replace the in-memory store with persistent models when the database schema is ready.
- Extend the controllers with validation and business logic.
- Update the Postman collection whenever new endpoints are introduced.
