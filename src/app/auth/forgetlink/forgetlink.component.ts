// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from 'src/app/core/Services/auth.service';

// @Component({
//   selector: 'app-forgetlink',
//   templateUrl: './forgetlink.component.html',
//   styleUrls: ['./forgetlink.component.scss']
// })
// export class ForgetlinkComponent {
//   forgotPasswordForm: FormGroup;
//   loading: boolean = false;

//   constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
//     this.forgotPasswordForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]]
//     });
//   }

//   // Submit the email for password reset
//   onSubmit() {
//     if (this.forgotPasswordForm.invalid) {
//       return;
//     }

//     this.loading = true;
//     const email = this.forgotPasswordForm.value.email;

//     this.authService.sendResetPasswordEmail(email).subscribe({
//       next: (response) => {
//         alert('mail sent success')
//         this.router.navigate(['/auth/login']);
//       },
//       error: (err) => {
//         alert('Inavlid')
//       },
//       complete: () => {
//         this.loading = false;
//       }
//     });
//   }
// }

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
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  toastIcon: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
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
        this.showCustomToast(
          'Reset link sent successfully! Check your email.',
          'success',
          'check-circle'
        );
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2500);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Failed to send reset link. Please try again.';
        this.showCustomToast(
          errorMessage,
          'error',
          'alert-circle'
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private showCustomToast(message: string, type: 'success' | 'error', icon: string) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastIcon = icon;
    this.showToast = true;

    setTimeout(() => {
      this.hideToast();
    }, 4000);
  }

  hideToast() {
    this.showToast = false;
  }
}
