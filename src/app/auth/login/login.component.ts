import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  form = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  error: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    // validation
    if (!this.form.valid) {
      for (let key in this.form.controls) {
        this.form.controls[key].markAsTouched();
      }
      return;
    }

    const { usernameOrEmail, password } = this.form.value;
    this.authService.login(usernameOrEmail, password).subscribe(
      user => {
        console.log(user);
        this.router.navigate(['/budget']);
      },
      error => {
        this.error = error;
        this.cdr.markForCheck();
      }
    );
  }
}
