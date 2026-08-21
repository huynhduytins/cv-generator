# Web CV Generator - Execution Plan

## Planning Principles (Derived from Specs + Project Rules)
- Build in strict sequence from data foundation to UI shell, then preview, export, and refinements.
- Keep a single source of truth in Zustand with immutable updates and explicit actions.
- Use strict TypeScript throughout (`no any`), with clear domain models for all CV sections.
- Enforce separation of concerns: presentation components stay UI-only, business logic lives in hooks/store/utils.
- Validate each phase with architectural and quality checks before moving forward.

## Suggested Project Structure Baseline
- `src/types/` - domain types and DTOs for CV data.
- `src/store/` - Zustand store slices, actions, persistence adapter.
- `src/hooks/` - form orchestration, debounced autosave, preview selectors.
- `src/components/form/` - multi-step/accordion form UI and section components.
- `src/components/layout/` - application shell (editor/preview split).
- `src/components/templates/` - CV template components and shared template primitives.
- `src/lib/pdf/` - export orchestration, page sizing, pagination helpers.
- `src/lib/validation/` - section-level validation schemas/rules.
- `src/lib/mappers/` - state-to-template and state-to-pdf mapping logic.

---

## Phase 1 - Core Data Architecture & State Management

### Clear Objectives
- Define the canonical CV domain model with strict TypeScript types.
- Implement a robust Zustand store as the single source of truth.
- Add local draft persistence with auto-save and safe hydration.
- Establish state boundaries to avoid unnecessary re-renders for preview/export flows.

### Actionable Tasks
1. Define top-level CV entities: `PersonalInfo`, `WorkExperience`, `Education`, `Skill`, `Project`, and `CvDocument`; also decide and document the exact PDF engine (`react-pdf` vs `html2pdf`) so Phase 3 template layout structure aligns with the chosen rendering pipeline.
2. Add reusable primitives (`Id`, `ISODate`, optional vs required field conventions, discriminated unions where needed).
3. Create type-safe action contracts for CRUD operations per section (add, update, reorder, remove).
4. Design store shape with clear slices:
   - `documentSlice` (CV content),
   - `uiSlice` (active step, expanded accordion panels),
   - `metaSlice` (lastSavedAt, dirty flag, schema version).
5. Implement Zustand store with immutable update patterns and selector-first consumption patterns.
6. Add persistence middleware scoped to draft-safe fields only (exclude transient UI if needed).
7. Implement schema versioning + migration stub for future shape changes.
8. Create auto-save trigger strategy (debounced write, initial hydration read, error-safe fallback).
9. Add unit tests for store actions and persistence/hydration behavior.
10. Document state conventions and update contracts in a short architecture note.

### Key Deliverables
- `src/types/cv.ts`
- `src/types/common.ts`
- `src/store/cv-store.ts`
- `src/store/slices/document-slice.ts`
- `src/store/slices/ui-slice.ts`
- `src/store/slices/meta-slice.ts`
- `src/store/persistence.ts`
- `src/store/migrations.ts`
- `src/hooks/useAutoSave.ts`
- `src/store/__tests__/cv-store.test.ts`
- `docs/architecture/state-management.md`

### Architectural & Quality Checks (Exit Criteria)
- Type safety: `tsc --noEmit` passes with zero `any` usage in new modules.
- State isolation: form inputs subscribe to narrow selectors; preview subscribes to computed view model selectors only.
- Persistence integrity: refresh restores draft accurately; corrupted storage falls back safely to default state.
- Immutability assurance: no direct mutation patterns in actions.
- Performance baseline: editing one field does not trigger full app rerender (verify with React DevTools profiling sample).

---

## Phase 2 - Layout Shell & Multi-step/Accordion Form Controls

### Clear Objectives
- Build the core app shell with responsive editor/preview layout.
- Implement sectioned form controls using multi-step or accordion interactions.
- Keep UI presentation-focused while delegating data logic to hooks/store actions.

### Actionable Tasks
1. Create App Router page scaffold for CV builder route.
2. Implement base shell layout:
   - left pane: form editor,
   - right pane: live preview area,
   - mobile fallback: stacked/segmented layout.
3. Build navigation controls for step progression and section jumping.
4. Create reusable form primitives (`TextField`, `TextArea`, `DateField`, `ArraySectionControls`) with typed props.
5. Implement section components for each CV block:
   - Personal Info,
   - Work Experience,
   - Education,
   - Skills,
   - Projects.
6. Extract orchestration logic into hooks:
   - implement debounced local input state for text fields before writing to global Zustand state to preserve near-60fps typing responsiveness,
   - section field binding helpers,
   - list item CRUD handlers,
   - step completion status selectors.
7. Add basic validation feedback (required markers, inline errors, section completion badges).
8. Wire all form controls to Zustand actions without introducing component-local duplicated source of truth.
9. Add component tests for navigation, CRUD in repeatable sections, and validation rendering.
10. Add accessibility checks for keyboard navigation and focus management across accordion/step transitions.

### Key Deliverables
- `src/app/page.tsx` (or builder route entry)
- `src/components/layout/CvBuilderShell.tsx`
- `src/components/form/StepNavigator.tsx`
- `src/components/form/AccordionNavigator.tsx`
- `src/components/form/sections/PersonalInfoSection.tsx`
- `src/components/form/sections/WorkExperienceSection.tsx`
- `src/components/form/sections/EducationSection.tsx`
- `src/components/form/sections/SkillsSection.tsx`
- `src/components/form/sections/ProjectsSection.tsx`
- `src/components/form/fields/*`
- `src/hooks/useCvFormController.ts`
- `src/lib/validation/cv-validation.ts`
- `src/components/form/__tests__/*`

### Architectural & Quality Checks (Exit Criteria)
- Separation of concerns: no business logic embedded in low-level field components.
- Type safety: typed props for all form components; no unsafe casts.
- State contract compliance: all user edits flow through store actions only.
- UX stability: step/accordion state persists across refresh when intended by store policy.
- Accessibility: tab order and expand/collapse controls are keyboard-operable and announce state correctly.

---

## Phase 3 - Real-time Live Preview Engine & Initial Template Component

### Clear Objectives
- Implement real-time preview rendering synchronized with store updates.
- Introduce first production-grade template component (e.g., Minimalist).
- Ensure preview updates are responsive without excessive rerenders.

### Actionable Tasks
1. Define a preview view model mapper to transform raw store data into template-ready data.
2. Implement memoized selectors for preview data to minimize recomputation.
3. Create `LivePreview` container connected to preview selector outputs.
4. Build initial template component with strict typed props and clear section blocks.
5. Create shared template primitives (header, section title, timeline row, tag list).
6. Implement empty-state handling and graceful omission of optional sections.
7. Add style tokens/classes to maintain consistency and future template reusability.
8. Add tests for mapping logic and template rendering across representative CV datasets.
9. Add lightweight performance instrumentation for keystroke-to-preview latency checks.
10. Verify preview fidelity against target CV layout expectations from spec.

### Key Deliverables
- `src/lib/mappers/cv-to-preview.ts`
- `src/store/selectors/preview-selectors.ts`
- `src/components/preview/LivePreview.tsx`
- `src/components/templates/minimalist/MinimalistTemplate.tsx`
- `src/components/templates/shared/*`
- `src/components/preview/__tests__/LivePreview.test.tsx`
- `src/lib/mappers/__tests__/cv-to-preview.test.ts`

### Architectural & Quality Checks (Exit Criteria)
- Render efficiency: preview rerenders only on relevant state changes (validated via profiling).
- Mapping isolation: no direct store reads inside deeply nested presentational template pieces.
- Type completeness: template props fully typed from preview view model, no implicit `unknown`/casts.
- Visual correctness: all core sections render predictably with missing/partial data.
- Responsiveness target: typing remains smooth with no noticeable lag in standard dataset scenarios.

---

## Phase 4 - Client-side PDF Rendering Engine & Page Break Controls

### Clear Objectives
- Build reliable client-side PDF export preserving template styling and pagination.
- Add user-facing page break controls for problematic section splits.
- Ensure export remains deterministic and privacy-preserving (no server dependency).

### Actionable Tasks
1. Select and lock PDF strategy (`react-pdf` or `html2canvas + jspdf`) based on fidelity/performance trade-off, and implement `@media print` utility rules or page-break boundary guards (`break-inside: avoid`) for template elements.
2. Build export service abstraction to decouple UI from rendering implementation.
3. Implement template-to-pdf rendering path matching live preview structure.
4. Add page size presets and margin configuration constants.
5. Implement pagination helpers with widow/orphan and section-boundary heuristics.
6. Add manual page break controls in UI for section-level overrides.
7. Add export progress/error states and non-blocking UX handling.
8. Test exports across representative CV lengths (1-page, 2-page, dense multi-section).
9. Validate generated file naming, metadata, and browser compatibility.
10. Add regression snapshots or checksum-based checks for core export scenarios.

### Key Deliverables
- `src/lib/pdf/export-cv.ts`
- `src/lib/pdf/renderers/*`
- `src/lib/pdf/pagination.ts`
- `src/lib/pdf/page-config.ts`
- `src/components/export/ExportPdfButton.tsx`
- `src/components/export/PageBreakControls.tsx`
- `src/lib/pdf/__tests__/*`
- `docs/architecture/pdf-engine.md`

### Architectural & Quality Checks (Exit Criteria)
- Fidelity check: exported PDF visually matches on-screen template within accepted tolerance.
- Performance check: export completes within acceptable time on typical laptop hardware and medium CV size.
- Determinism check: repeated exports from identical state produce consistent pagination.
- Failure handling: export errors surface actionable feedback without corrupting app state.
- Privacy check: no CV payload transmitted off-device during export.

---

## Phase 5 - Template Selector & Refinements

### Clear Objectives
- Introduce multi-template selection with consistent data contracts.
- Refine UX, performance, and quality across end-to-end workflow.
- Prepare for maintainable extension (new templates, richer sections) without architectural churn.

### Actionable Tasks
1. Define template registry contract (id, label, component, print settings compatibility).
2. Implement template selector UI and persist selected template in store.
3. Build at least one additional template variant sharing common primitives where possible.
4. Ensure preview + export both respect selected template consistently.
5. Add polish for editor usability (microcopy, disabled states, section reorder UX where applicable).
6. Conduct performance pass:
   - memoization review,
   - selector granularity review,
   - avoid unnecessary derived recomputation.
7. Add comprehensive integration tests for full flow:
   - input -> preview -> template switch -> export.
8. Run accessibility and responsive audits across major breakpoints.
9. Add developer documentation for adding new templates.
10. Prepare release checklist and known limitations list.

### Key Deliverables
- `src/components/templates/template-registry.ts`
- `src/components/templates/TemplateSelector.tsx`
- `src/components/templates/<second-template>/*`
- `src/store/slices/template-slice.ts` (or extension in existing slices)
- `src/components/templates/__tests__/*`
- `src/app/__tests__/cv-builder-flow.test.tsx`
- `docs/architecture/template-system.md`
- `docs/release-checklist.md`

### Architectural & Quality Checks (Exit Criteria)
- Contract stability: all templates implement the same typed interface and render from the same view model.
- Consistency: selected template affects both live preview and PDF output identically.
- Scalability: adding a new template requires minimal changes outside registry and new template module.
- Quality baseline: lint, type-check, unit/integration tests pass; no critical accessibility violations.
- Regression guard: key user flows remain stable after template switching and export operations.

---

## Cross-Phase Definition of Done
- `npm run lint` passes.
- `npm run typecheck` passes under strict TypeScript settings.
- Targeted tests for the completed phase are green before progressing.
- New modules follow project conventions for naming, folder boundaries, and separation of concerns.
- Architectural trade-offs for major decisions are documented briefly in `docs/architecture/`.
