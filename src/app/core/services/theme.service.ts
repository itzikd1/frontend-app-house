import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Theme mode signal (light/dark)
  private readonly _darkMode = signal<boolean>(this.getInitialThemePreference());

  // Expose the current theme mode as a read-only signal
  public readonly darkMode = this._darkMode.asReadonly();

  // Current theme name (for theming beyond light/dark)
  private readonly _theme = signal<string>('default');

  // Expose the current theme as a read-only signal
  public readonly theme = this._theme.asReadonly();

  private translationService = inject(TranslationService);

  // Direction (LTR/RTL) based on language
  public readonly direction = computed(() =>
    this.translationService.getCurrentLanguage() === 'he' ? 'rtl' : 'ltr'
  );

  // Available themes
  private readonly availableThemes = [
    { id: 'default', name: 'Default', primary: '#1976d2', accent: '#f50057' },
    { id: 'nature', name: 'Nature', primary: '#2e7d32', accent: '#ff8f00' },
    { id: 'ocean', name: 'Ocean', primary: '#1565c0', accent: '#00b0ff' },
    { id: 'sunset', name: 'Sunset', primary: '#c2185b', accent: '#ff9800' },
  ];

  constructor() {
    // Initialize theme
    this.applyTheme();

    // Watch for system color scheme changes
    if (window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      // Set initial value
      if (this._darkMode() === null) {
        this._darkMode.set(prefersDark.matches);
      }

      // Listen for changes
      prefersDark.addEventListener('change', (e) => {
        // Only apply system preference if user hasn't explicitly set a preference
        if (localStorage.getItem('theme-preference') === null) {
          this._darkMode.set(e.matches);
          this.applyTheme();
        }
      });
    }

    // Apply theme when dark mode changes
    effect(() => {
      this.applyTheme();
      this.updateDocumentClasses();
    });

    // Apply RTL when language changes
    effect(() => {
      this.updateDocumentDirection();
    });
  }

  /**
   * Toggle between light and dark theme
   */
  public toggleDarkMode(): void {
    this._darkMode.update(mode => !mode);
    // Save user preference
    localStorage.setItem('dark-mode', String(this._darkMode()));
    localStorage.setItem('theme-preference', 'user');
  }

  /**
   * Set the theme by ID
   * @param themeId Theme ID to set
   */
  public setTheme(themeId: string): void {
    const theme = this.availableThemes.find(t => t.id === themeId);
    if (theme) {
      this._theme.set(themeId);
      this.applyTheme();
      localStorage.setItem('theme', themeId);
    }
  }

  /**
   * Get all available themes
   */
  public getThemes() {
    return this.availableThemes;
  }

  /**
   * Get the current theme
   */
  public getCurrentTheme() {
    return this.availableThemes.find(t => t.id === this._theme()) || this.availableThemes[0];
  }

  /**
   * Apply the current theme to the document
   */
  private applyTheme(): void {
    const isDark = this._darkMode();
    const theme = this.getCurrentTheme();

    // Update CSS variables
    const root = document.documentElement;

    // Set primary and accent colors
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--accent-color', theme.accent);

    // Set dark/light mode
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  /**
   * Update document classes based on current theme and direction
   */
  private updateDocumentClasses(): void {
    const dir = this.direction();
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', this.translationService.getCurrentLanguage());
  }

  /**
   * Update document direction based on current language
   */
  private updateDocumentDirection(): void {
    const dir = this.direction();
    document.documentElement.setAttribute('dir', dir);
  }

  /**
   * Get the initial theme preference from localStorage or system preference
   */
  private getInitialThemePreference(): boolean {
    // Check for saved preference
    const savedPreference = localStorage.getItem('dark-mode');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }

    // Check for system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Default to light theme
    return false;
  }
}
