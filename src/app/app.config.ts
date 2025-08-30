import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true,
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({
        skipInitialTransition: true,
      })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        httpErrorInterceptor
      ])
    ),
    provideAnimations(),
    // Application services
    { provide: TranslationService, useClass: TranslationService },
    { provide: ThemeService, useClass: ThemeService },
    // Environment providers
    ...(isDevMode() ? [
      // Development only providers
    ] : [
      // Production only providers
    ]), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};
