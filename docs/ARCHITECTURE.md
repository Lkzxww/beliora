# 🏗️ Arquitetura da Beliora

## Objetivo

A Beliora é um SaaS para gerenciamento de barbearias, salões de beleza, clínicas de estética e profissionais autônomos.

O sistema será multiempresa (multi-tenant), escalável, seguro e preparado para crescimento.

---

# Stack

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query

---

## Backend

- NestJS
- TypeScript
- Prisma ORM
- JWT
- bcrypt

---

## Banco

- PostgreSQL

---

## Infraestrutura

Frontend → Vercel

Backend → Railway

Banco → Neon PostgreSQL

Arquivos → Cloudflare R2 (futuro)

---

# Arquitetura

Monorepo

beliora/

apps/

packages/

prisma/

docs/

docker/

---

# Comunicação

Frontend

↓

REST API

↓

NestJS

↓

Prisma

↓

PostgreSQL

---

# Princípios

- Código limpo
- SOLID
- Clean Architecture
- DRY
- KISS
- Conventional Commits

---

# Segurança

- JWT
- Senhas criptografadas com bcrypt
- Prisma ORM
- Variáveis de ambiente
- HTTPS

---

# Deploy

GitHub

↓

GitHub Actions

↓

Vercel

↓

Railway

↓

Neon