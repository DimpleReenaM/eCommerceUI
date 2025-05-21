import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/Services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   loginForm!:FormGroup;
     particles: any[] = [];


   constructor(private fb:FormBuilder,private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',Validators.required)
    })
        this.createParticles();

  }

  Login(){
    
    if(this.loginForm.valid){
       this.authService.Login({
        email:this.loginForm.get('email')?.value,
        password:this.loginForm.get('password')?.value
      })
      .subscribe(
        {
          next:(res)=>{
            if(res.isSuccessed==true) {
              this.router.navigateByUrl("");
            }
            else{
              alert(res.message)
            }
          }
        }
      )
    }
  }

 createParticles() {
  const particleCount = 500;
  for (let i = 0; i < particleCount; i++) {
    this.particles.push({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 5}px`,
      height: `${Math.random() * 10 + 5}px`,
      opacity: Math.random() * 0.5 + 0.5, // Increased opacity range (0.5 to 1)
      'animation-delay': `${Math.random() * 5}s`, // Reduced max delay from 15s to 5s
      'animation-duration': `${Math.random() * 10 + 5}s` // Reduced max duration from 30s to 15s
    });
  }
}

}
