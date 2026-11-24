# Inventario Web

> **Status: early-stage prototype — not production-ready.**

A small inventory-management application built with **React + Vite** (frontend) and **Node.js + Express + MySQL** (backend). The interface and API use Spanish labels and were developed around everyday inventory workflows for small businesses.

## What exists today

- List, create, edit and deactivate products.
- Record selling price, cost, units, minimum stock and categories.
- List, create, edit and delete categories.
- REST endpoints under `/api/v1/products` and `/api/v1/categories`.

This repository does **not** yet include a database schema or migration scripts, authentication, an automated test suite, or production deployment instructions. Please do not expose its API to the public internet or use it to store real business data as-is.

## Local development

Requirements: Node.js 20+ with npm, and a local MySQL server.

1. Backend:

   ```bash
   cd backend
   npm ci
   cp .env.example .env
   ```

   Edit `backend/.env` with **your own** MySQL credentials. Do not commit that file. The current repository does **not** provide the SQL schema; tables `products` and `categories` and the fields referenced by the controllers must exist before the API can be used.

   Start the API from `backend/`:

   ```bash
   npm run start
   ```

2. Frontend, in a separate terminal:

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

The current frontend connects to `http://localhost:5000/api/v1` (hard-coded in `frontend/src/App.jsx`). If you use a different API address you must adjust that setting. Use `npm run lint` and `npm run build` from `frontend/` for basic frontend checks.

## Security notice

A previous commit included `backend/.env` with a non-empty database password. Removing the file from the current tree does **not** erase it from Git history. Anyone who reused that password should **rotate it** and review database account access. Do not copy any historical credential into a new environment.

Current API routes do not require authentication and CORS is unrestricted. Keep this prototype on a trusted local machine only.

## Project status and contribution

This is a learning-stage project. The immediate priorities are:

1. Verify safe handling of secrets and remove tracked generated dependencies.
2. Add reproducible MySQL schema/migrations and a sample dataset.
3. Add automated backend/frontend tests.
4. Design authentication, authorization and safer deployment configuration before production use.
5. Publish small, reusable modules and accept substantive community contributions.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Report security concerns privately as described in [SECURITY.md](SECURITY.md).

## License

**License decision pending.** Publicly visible code is not automatically licensed for redistribution or commercial reuse. The maintainer will select an explicit OSI-approved license before advertising this project as fully open source.

---

### En español

Este repositorio es un **prototipo de sistema de inventario**, no una aplicación lista para producción. Tiene una interfaz React, una API Express y utiliza MySQL. Faltan el esquema de la base de datos, pruebas, autenticación y configuración de despliegue segura. Antes de usarlo, configura tus propias credenciales en un archivo `.env` local y revisa el aviso de seguridad anterior.
