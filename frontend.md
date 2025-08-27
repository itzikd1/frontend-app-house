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
1. **Translation Files**:
   - Create translation files for each supported language (en.json, he.json, etc.)
   - Store in `src/assets/i18n/`

2. **Translation Service**:
   - Create a `TranslationService` using signals
   - Handle language switching
   - Provide current language as a signal

3. **Translation Pipe**:
   - Create a custom pipe that works with signals
   - Automatically updates when language changes

4. **Language Switcher**:
   - Add language selection in the header
   - Update signal on language change

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

## Implementation Timeline
1. Day 1: Setup and basic structure
2. Day 2: Implement responsive behavior
3. Day 3: Add animations and polish
4. Day 4: Testing and bug fixes
5. Day 5: Final review and deployment
