# Changelog

All notable changes to Beliora will be documented in this file.

The format follows a simple release-oriented structure inspired by Keep a
Changelog.

## Unreleased

### Added

- Dashboard visual foundation.
- Responsive dashboard layout with sidebar, header, and main content.
- Agenda module with weekly calendar, mobile list, details panel, filters, and
  appointment counters.
- Smart calendar behavior with current-time marker, week navigation, dynamic
  week days, proportional appointment cards, and overlapping event layout.
- Prisma and Supabase read layer for Agenda.
- Demo seed data for company, employees, customers, services, and appointments.
- Server Actions for appointment creation, update, and cancelation.
- Server-side Zod validation for appointment actions.
- Schedule conflict validation by professional.
- Public roadmap documentation.
- Product quality sprint documentation.
- Portfolio delivery plan.

### Changed

- Agenda now uses real persisted data instead of mock data for the main route.
- Appointment form now uses persisted customer, employee, and service ids.
- Appointment schema now includes persisted `notes`.
- Appointment status enum now includes `CONFIRMED`.
- Demo seed now updates confirmed appointments and notes idempotently.

### Fixed

- Cancelation now persists as `CANCELED` instead of only updating local state.
- Editing an appointment now persists changes and respects company ownership.
- Duplicate cancelation is blocked with a clear error message.

### Known Limitations

- Authentication is not implemented yet.
- Dynamic multi-company tenancy is not implemented yet.
- `room` is still derived in the UI.
- `paymentStatus` is still derived in the UI.
- Drag and drop scheduling is planned for a future sprint.
