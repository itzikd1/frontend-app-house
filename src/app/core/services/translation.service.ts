import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Language = 'en' | 'he';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<Language>('en');
  currentLanguage$ = this.currentLanguage.asReadonly();

  private translations = signal<Record<string, string>>({});
  private loadedLanguages = new Set<Language>();
  private readonly http = inject(HttpClient);

  constructor() {
    effect(() => {
      this.loadTranslations(this.currentLanguage());
    });
  }

  private loadTranslations(lang: Language): void {
    if (this.loadedLanguages.has(lang)) return;
    this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations.set(data);
        this.loadedLanguages.add(lang);
      },
      error: () => {
        this.logError(`Failed to load translations for language: ${lang}`);
      }
    });
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userLanguage', lang);
    }
    this.loadTranslations(lang);
  }

  getTranslation(key: string): string {
    const translations = this.translations();
    // Support nested keys using dot notation
    const keyParts = key.split('.');
    let value: string | Record<string, unknown> = translations;
    for (const part of keyParts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, string>)[part];
      } else {
        this.logError(`Translation missing for key: ${key}`);
        return `[${key}]`;
      }
    }
    if (typeof value === 'string') {
      return value;
    }
    this.logError(`Translation missing for key: ${key}`);
    return `[${key}]`;
  }

  translate(key: string): string {
    return this.getTranslation(key);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage();
  }

  private logError(message: string): void {
    // Replace with a real logging service if needed
    // For now, fallback to console.warn in dev
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn(message);
    }
    // TODO: Integrate with error tracking service (e.g., Sentry)
  }
}
