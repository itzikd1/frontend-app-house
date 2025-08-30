import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

const AUTH_ENDPOINT_IDENTIFIER = '/auth/';

/**
 * Get the authentication token from local storage
 */
function getAuthToken(): string | null {
  // In a real app, you might want to get this from an auth service
  return localStorage.getItem('auth_token');
}

/**
 * Check if the request is for an auth endpoint
 */
function isAuthRequest(request: HttpRequest<unknown>): boolean {
  return request.url.includes(AUTH_ENDPOINT_IDENTIFIER);
}

/**
 * Interceptor to add authentication token to outgoing requests
 */
export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Skip for auth-related requests to avoid circular dependencies
  if (isAuthRequest(request)) {
    return next(request);
  }

  // Get the auth token from local storage
  const authToken = getAuthToken();

  // If we have a token, add it to the request
  if (authToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  return next(request);
}
