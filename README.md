# Beliora

Beliora is a SaaS platform for managing salons, barbershops, beauty clinics,
and independent beauty professionals.

The project is being built as a portfolio-grade product: modular architecture,
real database persistence, typed contracts, clear documentation, and a public
roadmap.

## Status

In active development.

Current focus:

- Dashboard foundation
- Smart calendar and appointment management
- Prisma and Supabase persistence
- Reusable product architecture for future modules

## Core Modules

- Dashboard
- Agenda
- Clientes
- Funcionarios
- Servicos
- Financeiro
- Relatorios
- Configuracoes

## Current Highlights

- Next.js App Router with Server Components by default
- TypeScript-first implementation
- Tailwind CSS and Shadcn/UI interface foundation
- Prisma ORM with PostgreSQL via Supabase
- Appointment CRUD through Server Actions
- Zod validation on client and server
- Conflict prevention for appointment scheduling
- Demo seed data for local and review workflows
- Public roadmap and changelog prepared for portfolio presentation

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/UI
- Lucide Icons
- React Hook Form
- Zod

### Data

- Prisma ORM
- PostgreSQL
- Supabase

### Planned Infrastructure

- Vercel
- Custom domain
- GitHub Actions
- Public documentation

## Project Structure

```text
apps/
  web/
    src/
      app/
      actions/
      components/
      lib/
      services/
      types/
docs/
prisma/
```

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run seed:dev
npx prisma validate
npx prisma generate
npx prisma migrate deploy
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Quality Sprint](docs/QUALITY_SPRINT.md)
- [Portfolio Delivery](docs/PORTFOLIO_DELIVERY.md)
- [Changelog](CHANGELOG.md)

## Portfolio Goal

Beliora is not only a demo app. The goal is to present a SaaS built with a
professional process: real architecture, real persistence, product polish,
documentation, deploy, screenshots, changelog, and roadmap.

## License

MIT
