// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from 'src/app/core/Services/auth.service';

// @Component({
//   selector: 'app-forget',
//   templateUrl: './forget.component.html',
//   styleUrls: ['./forget.component.scss']
// })
// export class ForgetComponent implements OnInit{
//   resetPasswordForm: FormGroup;
//   loading: boolean = false;
//   token: string = '';
//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.resetPasswordForm = this.fb.group({
//       newPassword: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', [Validators.required]]
//     });

//     // Get the token from URL parameters
//     this.token = this.route.snapshot.queryParams['token'];
//     console.log('tken',this.token)
//   }
//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       console.log(this.token)
//     });  }

//   // Submit the new password
//   onSubmit() {
//     if (this.resetPasswordForm.invalid) {
//       return;
//     }

//     if (this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
//       alert('Error!')
//       // Swal.fire();
//       return;
//     }

//     this.loading = true;
//     const newPassword = this.resetPasswordForm.value.newPassword;

//     this.authService.resetPassword(this.token, newPassword).subscribe({
//       next: (response) => {
//         alert('Password reset successful');
//         this.router.navigate(['/auth/login']);
//       },
//       error: (err) => {
//         alert('Password reset successful');
//         this.router.navigate(['/']);
//       },
//       complete: () => {
//         this.loading = false;
//       }
//     });
//   }
//   getPasswordStrengthClass(): string {
//   const password = this.resetPasswordForm.get('newPassword')?.value;
//   if (!password) return '';
  
//   const hasNumber = /\d/.test(password);
//   const hasMinLength = password.length >= 6;
  
//   if (!hasMinLength) return '';
  
//   if (password.length < 8 || !hasNumber) {
//     return 'strength-weak';
//   } else if (password.length < 12) {
//     return 'strength-medium';
//   } else {
//     return 'strength-strong';
//   }
// }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading: boolean = false;
  token: string = '';
  
  // Toast notification properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastIcon: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Get the token from URL parameters
    this.token = this.route.snapshot.queryParams['token'];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(this.token);
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Submit the new password
  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      if (this.resetPasswordForm.errors?.['mismatch']) {

        this.showCustomToast(
          'Passwords do not match!',
          'error',
          'alert-circle'
        );
      } else {
        this.showCustomToast(
          'Please fill all required fields correctly',
          'warning',
          'alert'
        );
      }
      return;
    }

    this.loading = true;
    const newPassword = this.resetPasswordForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.showCustomToast(
          'Password reset successfully! Redirecting to login...',
          'success',
          'check-circle'
        );
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Password reset failed. Please try again.';
        this.showCustomToast(
          errorMessage,
          'error',
          'close-circle'
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getPasswordStrengthClass(): string {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    if (!password) return '';
    
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    if (!hasMinLength) return '';
    
    if (password.length < 8 || !hasNumber) {
      return 'strength-weak';
    } else if (password.length < 12) {
      return 'strength-medium';
    } else {
      return 'strength-strong';
    }
  }

  private showCustomToast(message: string, type: 'success' | 'error' | 'warning', icon: string) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastIcon = icon;
    this.showToast = true;

    setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  hideToast() {
    this.showToast = false;
  }
}