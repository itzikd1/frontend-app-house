import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SuccessMessageComponent } from '../../shared/components/success-message/success-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ErrorMessageComponent,
    SuccessMessageComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public form: FormGroup;
  public loading = false;
  public error: string | null = null;
  public success = false;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  public async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    try {
      const result = await this.auth.login(this.form.value).toPromise();
      if (result && result.token && result.user) {
        this.auth.setAuth(result.token, result.user);
        this.success = true;
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid login response';
      }
    } catch (err: unknown) {
      this.error = (err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.loading = false;
    }
  }
}
