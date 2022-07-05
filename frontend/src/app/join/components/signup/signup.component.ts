import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  hide = true;
  
  username = new FormControl('', [Validators.required]);

  email = new FormControl('', [Validators.required, Validators.email]);

  password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  passwordConfirm = new FormControl('', [Validators.required]);


  getEmailErrorMessage() {
    if (this.email.hasError('email')) {
      return 'Not a valid email';
    }
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return 'Unknown error';
  }

  getUsernameErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a username';
    }

    return 'Unknown error';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('minlength')) {
      return 'Minimum length is 8';
    }
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }

    return 'Unknown error';
  }

  getPasswordConfirmErrorMessage() {
    if (this.passwordConfirm.hasError('required')) {
      return 'Please re-enter your password';
    }

    return 'Unknown error';
  }

}
