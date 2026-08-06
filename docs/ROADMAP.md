# Beliora Roadmap

This roadmap tracks the product direction for Beliora as a professional SaaS
portfolio project.

## Product Direction

Beliora is a management platform for salons, barbershops, beauty clinics, and
independent professionals. The product should feel premium, calm, reliable, and
ready for daily operations.

## Completed Foundation

- Project structure with npm workspaces
- Next.js web app in `apps/web`
- Dashboard visual foundation
- Responsive layout with sidebar, header, and content area
- Agenda page with weekly calendar
- Local appointment interactions
- Prisma and Supabase read layer for Agenda
- Server Actions for appointment creation, update, and cancelation
- Appointment schema alignment with `notes` and `CONFIRMED`
- Demo seed data for review and development

## Active Track

### Agenda

Goal: make the scheduling module reliable enough to become the pattern for
future CRUD modules.

Status:

- Real persistence implemented
- Conflict validation implemented
- Demo company resolver centralized
- Notes persisted
- Confirmed status persisted

Next improvements:

- Server-side toast integration
- Better action feedback patterns
- Calendar keyboard navigation
- Future drag and drop
- Future dynamic tenant resolution

### Clientes

Goal: create the first customer management module using the patterns proven by
Agenda.

Planned scope:

- Customer listing
- Customer details
- Customer creation and editing
- Search and filters
- Empty states
- Basic relationship with appointments

### Funcionarios

Goal: manage professionals who receive appointments.

Planned scope:

- Employee listing
- Active/inactive state
- Profile details
- Service assignment strategy
- Schedule availability in a future sprint

### Servicos

Goal: manage salon services used by appointments.

Planned scope:

- Service listing
- Duration
- Price
- Description
- Active/inactive state in a future schema update

## Future Product Modules

- Financeiro
- Relatorios
- Configuracoes
- Authentication
- Multi-company tenancy
- Roles and permissions
- Notifications
- Public booking page

## Sprint 10: Product Quality

This sprint should happen after the main modules are functional. It should not
add business features. Its purpose is to make Beliora feel like a polished
market-ready SaaS.

Focus areas:

- Animations and microinteractions
- Accessibility
- Skeletons
- Loading states
- Toasts
- Light and dark theme polish
- Keyboard shortcuts
- Visual polish and responsive review

See [Quality Sprint](QUALITY_SPRINT.md).

## Final Sprint: Public Portfolio Delivery

This sprint turns Beliora from a working project into a complete public case
study.

Deliverables:

- Custom domain
- Vercel deploy
- Professional README
- Technical documentation
- Screenshots
- Demo video
- Changelog
- Public roadmap

See [Portfolio Delivery](PORTFOLIO_DELIVERY.md).
