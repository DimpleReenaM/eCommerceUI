import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-forgetlink',
  templateUrl: './forgetlink.component.html',
  styleUrls: ['./forgetlink.component.scss']
})
export class ForgetlinkComponent {
  forgotPasswordForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Submit the email for password reset
  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.forgotPasswordForm.value.email;

    this.authService.sendResetPasswordEmail(email).subscribe({
      next: (response) => {
        alert('mail sent success')
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Inavlid')
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
