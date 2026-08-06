# Sprint 10: Product Quality

## Objective

Improve the perceived quality of Beliora without adding new business features.

This sprint exists to make the product feel complete, refined, accessible, and
ready for portfolio presentation or client demos.

## Scope

### Animations

- Subtle hover transitions
- Sheet and panel transitions
- Button active states
- Calendar card feedback
- No new animation library unless there is a strong reason

### Accessibility

- Visible focus states
- Keyboard navigation for primary workflows
- Correct `aria-*` attributes for interactive states
- Form error messages associated with fields
- Color contrast review
- Screen-reader friendly labels for icon-only actions

### Skeletons

- Dashboard loading skeletons
- Agenda loading skeletons
- Future CRUD list skeletons
- Detail panel skeletons

### Loading States

- Pending states for Server Actions
- Disabled states during submit
- Loading labels where useful
- Consistent behavior for create, update, and cancel actions

### Toasts

- Success toasts for completed actions
- Error toasts for recoverable failures
- Neutral messages for empty or unchanged states
- Avoid exposing internal server or database details

### Theme Polish

- Confirm light theme contrast
- Review dark theme surfaces
- Verify sidebar, sheets, cards, forms, and badges
- Avoid one-note palettes
- Keep Beliora visual identity consistent

### Keyboard Shortcuts

Potential shortcuts:

- New appointment
- Search focus
- Go to today
- Previous week
- Next week
- Close sheet

Shortcuts should be discoverable later, but this sprint can implement the
foundation first.

### Visual Polish

- Responsive pass on desktop, tablet, and mobile
- Text overflow review
- Empty states
- Button sizing
- Sheet spacing
- Calendar readability
- Form density and hierarchy

## Acceptance Criteria

- No new business functionality is introduced
- No database schema changes are required
- Core workflows remain stable
- `npm run lint` passes
- `npm run build` passes
- Key screens have screenshots captured for review
- Manual keyboard and responsive checks are documented

## Recommended Order

1. Audit current UI states
2. Add shared loading and empty-state patterns
3. Improve action feedback
4. Review accessibility
5. Polish theme support
6. Add keyboard shortcuts
7. Capture screenshots
8. Run final lint and build
