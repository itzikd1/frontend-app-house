import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  public form: FormGroup;
  public loading = false;
  public error: string | null = null;
  public success = false;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  public async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    try {
      await this.auth.register(this.form.value).toPromise();
      this.success = true;
      this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      this.error = (err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.loading = false;
    }
  }
}
