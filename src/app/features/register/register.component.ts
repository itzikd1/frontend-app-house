import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    try {
      await this.auth.register(this.form.value).toPromise();
      this.success = true;
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Registration failed';
    } finally {
      this.loading = false;
    }
  }
}
