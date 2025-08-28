import { Component, signal, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { ThemeService } from '../../../core/services/theme.service';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth.service';

const DEFAULT_ICON = 'help_outline';

interface NavigationItem {
  path: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private readonly translationService = inject(TranslationService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  public readonly isMenuOpen = signal(false);
  public readonly currentLanguage = this.translationService.currentLanguage$;
  public readonly isDarkMode = this.themeService.darkMode;
  public readonly currentTheme = this.themeService.theme;
  public navigationItems: NavigationItem[] = [];

  // Available themes for the theme picker
  public readonly themes = this.themeService.getThemes();

  // Theme icon based on current theme
  public readonly themeIcon = computed(() => this.isDarkMode() ? 'dark_mode' : 'light_mode');

  // Menu references for template
  public languageMenuTrigger: MatMenuTrigger | null = null;
  public profileMenuTrigger: MatMenuTrigger | null = null;

  public readonly isAuthenticated$ = this.authService.isAuthenticated$;

  ngOnInit(): void {
    // Initialize navigation items from routes
    this.navigationItems = routes
      .filter(route => route.path && route.path !== '**' && route.path !== '')
      .map(route => {
        const path = route.path || '';
        // Use lowercase title keys for i18n
        const titleKey = (route.data?.['title'] || path).toLowerCase();
        return {
          path: `/${path}`,
          title: `menu.${titleKey}`,
          icon: route.data?.['icon'] || DEFAULT_ICON,
        };
      });
  }

  public toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  public setLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }

  public toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  public setTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  public trackByFn(index: number, item: NavigationItem): string {
    return item.path;
  }

  public get publicNavigationItems(): NavigationItem[] {
    return this.navigationItems.filter(item =>
      item.path === '/login' || item.path === '/register'
    );
  }

  public get protectedNavigationItems(): NavigationItem[] {
    return this.navigationItems.filter(item =>
      ['/dashboard', '/tasks', '/family', '/cars', '/notes', '/users', '/goals', '/recipes', '/profile', '/settings'].includes(item.path)
    );
  }

  public logout(): void {
    this.authService.logout();
    this.isMenuOpen.set(false);
    this.router.navigate(['/login']);
  }
}
