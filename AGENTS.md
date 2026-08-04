# Beliora Agent Instructions

Leia antes de alterar o projeto:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/FRONTEND_ARCHITECTURE.md`
- `prisma/schema.prisma`

## Regras

- Preserve a arquitetura existente.
- Use npm workspaces.
- O frontend está em `apps/web`.
- Use Next.js App Router, TypeScript, Tailwind e Shadcn/UI.
- Use Server Components por padrão.
- Não altere banco, migrations ou variáveis de ambiente sem solicitação explícita.
- Não exponha segredos.
- Não remova funcionalidades existentes.
- Faça mudanças pequenas, verificáveis e bem organizadas.
- Execute lint e build antes de concluir.