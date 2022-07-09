import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ConfirmPassErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty && control.touched);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty && control.touched);

    const invalidusername = !!(control?.parent?.get('username')?.invalid);
    const invalidEmail = !!(control?.parent?.get('email')?.invalid);
    const invalidPass = !!(control?.parent?.get('password')?.invalid);

    const invalidFinal = invalidParent && !(invalidusername || invalidEmail || invalidPass);

    return invalidCtrl || invalidFinal;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;

  hide = true;

  passMatcher = new ConfirmPassErrorStateMatcher();

  constructor(private formBuilder: FormBuilder) {}

  checkPasswords: ValidatorFn = (control: AbstractControl):  ValidationErrors | null =>{
    const password = control.get('password')?.value;
    const confirmPassword = control.get('passwordConfirm')?.value;

    if((password === confirmPassword) && (password !== null && confirmPassword !== null)) {
      return null;
    } else {
      return {passwordsNotMatching: true};
    }
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        username: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        passwordConfirm: [null, [Validators.required]],
        acceptTosAndRules: [null, [Validators.requiredTrue]],
      },
      {
        validators: this.checkPasswords,
      }
    );
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }
  }
}
