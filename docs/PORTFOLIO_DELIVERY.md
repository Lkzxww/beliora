# Portfolio Delivery Plan

## Objective

Package Beliora as a public SaaS case study with enough polish and process
evidence to support interviews, client conversations, and portfolio review.

## Deliverables

### Domain

- Choose final domain
- Configure DNS
- Connect domain to Vercel
- Verify HTTPS

### Deploy

- Deploy web app to Vercel
- Configure production environment variables
- Run production build checks
- Verify `/api/health`
- Verify `/agenda`
- Confirm no secrets are exposed

### Documentation

- Professional README
- Architecture docs
- Frontend architecture docs
- Roadmap
- Changelog
- Setup instructions
- Known limitations

### Screenshots

Recommended screenshots:

- Dashboard overview
- Agenda weekly calendar
- New appointment sheet
- Appointment detail panel
- Mobile agenda list
- Dark theme when complete

### Demo Video

Recommended structure:

1. Product overview
2. Dashboard
3. Agenda navigation
4. Create appointment
5. Edit appointment
6. Conflict validation
7. Cancel appointment
8. Architecture summary

Target duration: 2 to 4 minutes.

### Changelog

- Keep user-facing changes grouped by release
- Include schema changes when relevant
- Separate features, improvements, fixes, and known limitations

### Public Roadmap

- Show completed foundation
- Show active modules
- Show future product direction
- Keep roadmap honest and realistic

## Release Checklist

- `npx prisma validate`
- `npm run lint`
- `npm run build`
- Seed demo data verified
- Main workflows manually tested
- Screenshots captured
- README reviewed
- Changelog updated
- Roadmap updated
- Production deploy verified

## Positioning

Beliora should be presented as a SaaS developed with a professional process:

- Product thinking
- Clean architecture
- Typed implementation
- Real persistence
- Documented decisions
- Iterative delivery
- Quality sprint before public release
