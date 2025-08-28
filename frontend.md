# Frontend Implementation Plan: House Management App

## 1. Responsive Header/Navbar Component

### Component Structure
- **Component Name**: `AppHeader`
- **Location**: `src/app/shared/components/header/app-header/`
  - `app-header.component.ts`
  - `app-header.component.html`
  - `app-header.component.scss`
  - `app-header.component.spec.ts`

### Features
1. **Responsive Design**:
   - Desktop: Horizontal menu with all navigation items visible
   - Mobile: Hamburger menu with simple show/hide functionality
   - No animations for better performance and simpler implementation

2. **i18n Support**:
   - Built-in Angular i18n for translations
   - Language switcher in the header
   - Signal-based language state management

3. **State Management**:
   - Angular Signals for reactive state management
   - Signal-based menu toggling
   - Signal-based language switching

4. **Navigation Items**:
   - Dashboard (Home)
   - Tasks
   - Family
   - Vehicles
   - Recipes
   - Profile/Settings (with dropdown)

3. **User Interface Elements**:
   - App logo/name on the left
   - Navigation links in the center (desktop)
   - User avatar/name with dropdown on the right
   - Mobile menu toggle button (hamburger icon)
   - Active route highlighting

### Implementation Steps

1. **Setup Shared Module**
   - Create a shared module to hold reusable components
   - Export the header component for app-wide use

2. **Create Header Component**
   - Generate the component using Angular CLI
   - Implement responsive layout with CSS Grid/Flexbox
   - Add Angular Material for UI components

3. **Implement Responsive Behavior**
   - Use Angular's `@angular/cdk/layout` for responsive breakpoints
   - Toggle mobile menu visibility based on screen size using signals
   - No animations for simpler implementation and better performance

4. **Navigation**
   - Use Angular Router for navigation
   - Implement active route highlighting
   - Add proper ARIA attributes for accessibility

5. **Theming**
   - Use CSS variables for theming support
   - Implement light/dark mode toggle
   - Ensure proper contrast ratios for accessibility

## 2. i18n Configuration

### Setup
1. **Translation Files**: ✅ en.json, he.json exist in src/assets/i18n
2. **Translation Service**: ✅ translation.service.ts uses signals and persists language in localStorage
3. **Translation Pipe**: ✅ translate.pipe.ts exists
4. **Language Switcher**: ✅ Implemented in header.component.html

## 3. Signals Implementation

### State Management
```typescript
// Example signal for menu state
readonly isMenuOpen = signal(false);

// Example signal for current language
readonly currentLanguage = signal('en');

// Toggle menu
toggleMenu() {
  this.isMenuOpen.update(isOpen => !isOpen);
}

// Change language
setLanguage(lang: string) {
  this.currentLanguage.set(lang);
  // Update i18n service
}
```

### Template Usage
```html
<button (click)="toggleMenu()">
  {{ isMenuOpen() ? 'Close' : 'Menu' | translate }}
</button>

<select [ngModel]="currentLanguage()" (ngModelChange)="setLanguage($event)">
  <option value="en">English</option>
  <option value="he">עברית</option>
</select>
```

## 4. Mobile-First CSS Strategy

### Breakpoints
```scss
// Base styles (mobile first)
:host {
  // Mobile styles here
}

// Small tablets and large phones (landscape)
@media (min-width: 640px) {}

// Tablets
@media (min-width: 768px) {}

// Small desktops
@media (min-width: 1024px) {
  // Desktop-specific styles
}
```

## 3. Dependencies

### Required Packages
- `@angular/material` - For UI components
- `@angular/cdk` - For responsive layout utilities
- `@angular/localize` - For i18n support
- `@angular/core` - For signals (built-in)
- **Translation files present:** ✅

## 4. State Management

### Data to Track with Signals
- Current active route
- Mobile menu open/closed state (signal)
- Current language (signal)
- User authentication status
- Theme preference (light/dark)

## 5. Testing Strategy

### Unit Tests
- Component initialization
- Signal behavior and updates
- Responsive behavior at different breakpoints
- Navigation functionality
- Mobile menu toggle
- Language switching functionality

### E2E Tests
- Navigation between routes
- Mobile menu interactions
- Responsive design verification

## 6. Accessibility Considerations
- Keyboard navigation
- Screen reader support
- Proper heading hierarchy
- Focus management
- Color contrast

## 7. Performance Optimization
- Signal-based change detection for better performance
- Lazy loading of navigation-related assets
- Optimized images and icons
- Minimized CSS/JS bundle size
- On-demand loading of translation files

## 8. Future Enhancements
- Notification badges
- Quick actions in mobile view
- Offline support indicator
- RTL (Right-to-Left) language support
- Persist language preference

## 9. Linting & Formatting
   Use ESLint with custom rules matching project guidelines.
   Integrate Prettier for consistent code formatting.
   Enforce 2-space indentation, single quotes, trailing commas, and import order.
   Add Husky pre-commit hooks to run linting and tests.

## 10. Testing Framework
    Use Jest for unit tests.
    Ensure every exported function/class has at least one test.
    Maintain high test coverage for components, services, and utilities.

## 11. Error Handling
    Implement global error handler using Angular's ErrorHandler.
    Use try/catch in async code.
    Add error boundaries for critical UI components.

## 12. Immutability & Pure Functions
    Prefer immutability in state management and utility functions.
    Avoid mutating function arguments and objects.
    Use pure functions for data transformations.

## 13. Named Constants
    Define all magic numbers/strings as named constants in a dedicated file.
    Use enums for fixed sets of values.

## 14. Consistent File Naming
    Enforce kebab-case for all files and Angular component selectors.

## 15. ChangeDetectionStrategy.OnPush
    Use ChangeDetectionStrategy.OnPush for all Angular components to optimize performance.

## 16. Persisting Preferences
    Store language and theme preferences in local storage. ✅
    Load preferences on app startup and update signals accordingly. ✅

## 17. Feature Module Structure & Lazy Loading
    Organize features into Angular modules.
    Use lazy loading for feature modules to reduce initial bundle size.

## 18. HTTP Interceptors & Router Guards
    Implement HTTP interceptors for authentication and error handling.
    Use router guards to protect routes and manage access control.

## 19. Skeleton Loaders & Service Worker (PWA)
    Add skeleton loaders for async data fetching.
    Integrate Angular service worker for offline support and caching.

## 20. Local Storage for User Preferences

## 21. General Coding Guidelines
    Use ChangeDetectionStrategy.OnPush for all Angular components. ✅
    Prefer named exports over default exports.
    Avoid magic numbers/strings; use named constants.
    Limit function length to 40 lines and cyclomatic complexity.
    Always handle errors; use try/catch for async code.
    Prefer async/await over callbacks and .then().
    Avoid deep nesting (max 3 levels).
    Always update/add tests when changing code.
    Prefer immutability; avoid mutating arguments/objects.
    Use explicit access modifiers in TypeScript classes.
    Avoid using any; use specific types or generics.
    Prefer interfaces to type aliases for object shapes.
    Avoid side effects in functions; keep them pure when possible.
    Avoid circular dependencies between modules.
    Disallow implicit any types.
    Discourage use of the non-null assertion operator (!).
    Enforce consistent file naming (e.g., kebab-case).
    For Angular, enforce kebab-case for component selectors.
    Disallow usage of deprecated APIs.
    Discourage leaving commented-out code in the codebase.
    Enforce consistent member ordering for classes/interfaces (fields, constructor, methods).
    Use ChangeDetectionStrategy.OnPush for all Angular components.
    Do not enforce readOnly properties in TypeScript interfaces unless explicitly required.

## 22. Testing Guidelines
    Use Jest for unit tests.
    Always include at least one test for each exported function or class.

## Implementation Timeline
1. Day 1: Setup and basic structure
2. Day 2: Implement responsive behavior
3. Day 3: Add animations and polish
4. Day 4: Testing and bug fixes
5. Day 5: Final review and deployment

---
### Recent Improvements
- Translation files (en.json, he.json) added and loaded from assets.
- ChangeDetectionStrategy.OnPush enforced in header component.
- Language and theme preferences are now persisted in localStorage.
