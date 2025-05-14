import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterSellerDto } from 'src/app/core/Models/RegisterSellerDto';
import { SellerService } from 'src/app/core/Services/seller.service';
    declare var Razorpay: any; // Declare Razorpay


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup;
    showPassword: boolean = false;
      message: string='';




  constructor(private fb: FormBuilder, private userService: SellerService,private router:Router) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      businessName: ['', Validators.required],
      businessType: ['', Validators.required],
      gstNumber: ['', Validators.required],
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
  if (this.form.invalid) return;

  const sellerData: RegisterSellerDto = this.form.value;

  // Example: ₹499 registration fee
  const options = {
    key: 'rzp_test_Bei5VTuZ2Tb1qg', // Replace with your key
    amount: 100, // in paise = ₹499
    currency: 'INR',
    name: 'Seller Registration',
    description: 'Register as a seller',
    handler: (response: any) => {
      this.registerSeller(sellerData);
    },
    prefill: {
      name: sellerData.userName,
      email: sellerData.email,
      contact: sellerData.phoneNumber
    },
    theme: {
      color: '#3399cc'
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();

  rzp.on('payment.failed', (response: any) => {
    alert('Payment failed. Registration not completed.');
  });
}
registerSeller(seller: RegisterSellerDto) {
  this.userService.registerSeller(seller).subscribe({
    next: (res:any) => {alert('registration successful');
          this.router.navigate(['/auth/login']); 
    },// ✅ redirect here
    error: (err) => alert(err.error?.message || 'Registration failed'),
  });
}
}
