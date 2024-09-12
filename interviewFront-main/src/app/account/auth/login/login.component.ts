import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  submitted: boolean = false;
  error: string = '';
  returnUrl: string;
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Get return URL or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Convenient getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Proceed to login
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (response) => {
          // Login success, navigate to the return URL
          console.log(this.loginForm);
          
          this.router.navigate(['/contacts/profile']);
          localStorage.setItem('user', JSON.stringify(response));
        },
        error: (err) => {
          // Handle login error
          console.log(this.loginForm.value);
          this.error = 'Email or password is incorrect'; // Set an error message for the UI
          console.error('Login error', err);
        }
      });
  }
}
