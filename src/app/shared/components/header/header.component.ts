import { Component, signal, inject, OnInit, computed } from '@angular/core';
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
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private translationService = inject(TranslationService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  
  isMenuOpen = signal(false);
  currentLanguage = this.translationService.currentLanguage$;
  isDarkMode = this.themeService.darkMode;
  currentTheme = this.themeService.theme;
  navigationItems: NavigationItem[] = [];
  
  // Available themes for the theme picker
  themes = this.themeService.getThemes();
  
  // Theme icon based on current theme
  themeIcon = computed(() => this.isDarkMode() ? 'dark_mode' : 'light_mode');
  
  // Menu references for template
  languageMenuTrigger: MatMenuTrigger | null = null;
  profileMenuTrigger: MatMenuTrigger | null = null;

  ngOnInit(): void {
    // Initialize navigation items from routes
    this.navigationItems = routes
      .filter(route => route.path && route.path !== '**' && route.path !== '')
      .map(route => {
        const path = route.path || '';
        return {
          path: `/${path}`,
          title: route.data?.['title'] || path.toUpperCase(),
          icon: route.data?.['icon'] || 'help_outline',
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

  toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  setLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }
  
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
  
  setTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }
  
  trackByFn(index: number, item: NavigationItem): string {
    return item.path;
  }
}
