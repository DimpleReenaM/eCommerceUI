import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit{
  resetPasswordForm: FormGroup;
  loading: boolean = false;
  token: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Get the token from URL parameters
    this.token = this.route.snapshot.queryParams['token'];
    console.log('tken',this.token)
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(this.token)
    });  }

  // Submit the new password
  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    if (this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
      alert('Error!')
      // Swal.fire();
      return;
    }

    this.loading = true;
    const newPassword = this.resetPasswordForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        alert('Password reset successful');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Password reset successful');
        this.router.navigate(['/']);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
