# 📦 Monorepo Project: Fullstack Multi-Tenant Application

This is a fullstack monorepo designed for scalable, multi-tenant applications. It includes a modern frontend built with **Next.js 15** and **Tailwind CSS v4**, a powerful backend with **Prisma**, and shared logic/components in a common package.

---

## 📁 Folder Structure

root/
├── client/ # Frontend: Next.js 15 + Tailwind CSS v4
├── server/ # Backend: API routes, auth logic, Prisma schema
├── shared/ # Shared types, utils, and constants

├── ProjectInfo / # Folder maintained by the Author and Devs for internal tasks and as a record of project history and some components they may need in the future. Ignore this folder totally!


---

## 🧠 Project Context (For AI Tools & Devs)

> Use the following context for all tools, automation, or AI assistants:

- **Frontend (`client/`)**
  - Built with **Next.js 15**
  - Uses **Tailwind CSS v4**
  - Contains all user-facing pages, components, and layouts

- **Backend (`server/`)**
  - Houses auth, API routes, business logic
  - May also integrate or other services

- **Shared (`shared/`)**
  - Contains reusable TypeScript types, validation schemas, and shared utilities
  - Shared across both frontend and backend
   - Uses **Prisma** with schema defined at:  
    `shared/prisma/schema.prisma`

- **Monorepo Management**
  - May use TurboRepo or other build tools
  - Shared code should not be duplicated between folders

- **Access Control**
  - The application implements **ABAC (Attribute-Based Access Control)** instead of traditional RBAC

- **Tenancy**
  - Supports **multi-tenant** architecture with tenant-specific data isolation

---

## 📦 Development Commands

Always use **npm** instead of `pnpm` or `yarn` for consistency across environments.

### Install Dependencies

```bash
npm install


## Run Frontend (client)

cd client
npm run dev

## Run Backend (server)

cd server
npm run dev


📁 Prisma
The Prisma schema is located at:


shared/prisma/schema.prisma
To generate types:


cd server
npx prisma generate
To run migrations:


cd server
npx prisma migrate dev

🚀 Deployment Notes

Frontend can be deployed on Vercel

Backend can run on Fly.io, Render, or Docker-based cloud setups

Shared code is expected to work cross-platform with strict TypeScript enforcement

🧠 Notes for AI Assistants
If you're using AI to generate code:

Stick to the folder conventions

Respect ABAC and tenant isolation

Use Next.js App Router conventions in client/

Always assume npm is the package manager

Tailwind CSS is already set up with darkMode: "class"


🧩 Roadmap (Optional)
 Add CI/CD workflows

 Implement full auth via Lucia

 Role & permission UI for ABAC

 Add unit + integration tests

 🧑‍💻 Author

Zenith 
Founder, Paathshala Educare, Next Photon Ecademy
EduTech Entrepreneur · Physics Educator · Fullstack Developer