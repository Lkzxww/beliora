# Frontend Architecture — Beliora

## Objetivo

Definir os padrões técnicos e visuais do frontend da Beliora para manter consistência entre telas, componentes e fluxos.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/UI com Base UI e preset Nova
- Lucide Icons
- React Hook Form
- Zod
- Prisma
- PostgreSQL via Supabase

## Estrutura

```text
apps/web/src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── actions/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── forms/
│   ├── companies/
│   ├── employees/
│   ├── services/
│   ├── customers/
│   └── appointments/
├── hooks/
├── lib/
├── schemas/
├── services/
└── types/