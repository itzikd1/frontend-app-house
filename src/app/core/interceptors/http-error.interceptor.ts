import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * Get user-friendly error message based on HTTP status code
 */
function getServerErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 400:
      return 'Bad Request: The request was invalid.';
    case 401:
      return 'Unauthorized: Please log in again.';
    case 403:
      return 'Forbidden: You do not have permission to access this resource.';
    case 404:
      return 'Not Found: The requested resource was not found.';
    case 500:
      return 'Internal Server Error: Please try again later.';
    case 503:
      return 'Service Unavailable: The service is currently unavailable. Please try again later.';
    default:
      return error.message || 'An unknown error occurred';
  }
}

/**
 * Interceptor to handle HTTP errors globally
 */
export function httpErrorInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';
      const errorObj = error.error;

      if (errorObj instanceof ErrorEvent) {
        errorMessage = `Error: ${errorObj.message}`;
      } else if (errorObj && Array.isArray(errorObj.errors)) {
        errorMessage = errorObj.errors.join(' ');
      } else {
        errorMessage = getServerErrorMessage(error);
      }

      // Show error to user
      snackBar.open(errorMessage, 'Dismiss', {
        duration: 4000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      return throwError(() => error);
    })
  );
}
