# Ecommerce Project (Django + React)

This repo contains a Django backend and a React (Vite) frontend for a sample e-commerce app.

## Quick start (backend)

1. Create and activate a Python virtual environment:
   - python -m venv .venv
   - Windows: .venv\Scripts\Activate.ps1 (or Activate.bat)
   - macOS/Linux: source .venv/bin/activate

2. Install backend dependencies:
   - pip install -r backend/requirements.txt

3. Run migrations and seed data:
   - cd backend
   - python manage.py migrate
   - python manage.py seed_data

   This creates a test user `devuser` / `devpass123` and some sample products.

4. Run the backend server:
   - python manage.py runserver

## Quick start (frontend)

1. Install Node.js dependencies:
   - cd frontend
   - npm install

2. Start dev server:
   - npm run dev

3. Open the app at the URL printed by Vite (usually http://localhost:5173 or 5174).

## Notes

- API is served under `/api/` (e.g., `http://127.0.0.1:8000/api/products/`)
- CORS is enabled in development (CORS_ALLOW_ALL_ORIGINS = True)
- Default test credentials: devuser / devpass123

If you want, I can add more convenience scripts (like a single `make dev` or `npm script`) to run both servers concurrently.