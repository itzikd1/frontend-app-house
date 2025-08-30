# Service Refactor Plan: Signals & Optimistic UI

## Goals
- Refactor all Angular services to use signals for state management.
- Implement optimistic UI updates: update signals immediately, sync with backend in background.
- Remove unnecessary RxJS usage where signals suffice.
- Ensure robust error handling and revert state on backend errors.
- Follow project linting and style rules.

## Steps

1. **Audit Services**
   - List all CRUD services in `src/app/core/services/`.
   - Review current RxJS and HttpClient usage.

2. **Design Signal State**
   - For each entity, create a signal for local state (e.g., `familiesSignal`).
   - Expose readonly signals for component consumption.

3. **Optimistic CRUD Operations**
   - On create/update/delete, update the signal immediately.
   - Perform HTTP request in the background.
   - On success: do nothing (signal already updated).
   - On error: revert signal and handle error (show message).

4. **Refactor Service Methods**
   - Replace RxJS state with signals.
   - Use async/await for HTTP calls.
   - Ensure error handling is robust and user-friendly.

5. **Update Components**
   - Refactor components to use signals from services.
   - Use Angular’s `computed()` for derived state.

6. **Testing**
   - Update/add Jest unit tests for all service methods.
   - Test optimistic updates, error handling, and signal state changes.

7. **Linting & Style**
   - Follow all project linting and style rules.
   - Remove unused RxJS imports and Observables.

8. **Documentation**
   - Document the new signal-based pattern for maintainers.

---

**Note:**
Start with one service (e.g., `FamilyService`) as a template, then apply the pattern to others.
Always validate changes with tests and linting.

