import { Component, signal, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { ThemeService } from '../../../core/services/theme.service';
import { routes } from '../../../app.routes';
import { filter } from 'rxjs/operators';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { AuthService } from '../../../core/services/auth.service';

const DEFAULT_ICON = 'help_outline';

interface NavigationItem {
  path: string;
  title: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatButtonToggleGroup,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    TranslatePipe,
    MatMenuTrigger
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
          title: titleKey,
          icon: route.data?.['icon'] || DEFAULT_ICON,
          isActive: false
        };
      });

    // Update active state on route changes
    this.router.events
      .pipe(
        filter(event => event.constructor.name === 'NavigationEnd')
      )
      .subscribe(() => {
        const currentUrl = this.router.url.split('?')[0];
        this.navigationItems = this.navigationItems.map(item => ({
          ...item,
          isActive: currentUrl === item.path
        }));
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

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get publicNavigationItems(): NavigationItem[] {
    return this.navigationItems.filter(item =>
      item.path === '/login' || item.path === '/register'
    );
  }

  public get protectedNavigationItems(): NavigationItem[] {
    return this.navigationItems.filter(item =>
      ['/dashboard', '/tasks', '/family', '/vehicles', '/recipes', '/profile', '/settings'].includes(item.path)
    );
  }

  public logout(): void {
    this.authService.logout();
    this.isMenuOpen.set(false);
    this.router.navigate(['/login']);
  }
}
