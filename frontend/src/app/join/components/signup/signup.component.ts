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
import { JoinService } from '../../service/join.service';
import { Router } from '@angular/router';
import { map, Observable, of, debounceTime } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  nameControl: FormControl | undefined;

  passConfirmControl: FormControl | undefined;

  signUpForm!: FormGroup;

  hide = true;

  joiningRoom: string | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private joinService: JoinService,
    private router: Router
  ) {
    this.joinService.isJoiningRoom$.subscribe((joiningRoom) => {
      this.joiningRoom = joiningRoom;
    });
  }

  ngOnInit(): void {
    this.nameControl = this.formBuilder.control(
      '',
      [this.userNameValidator.bind(this)],
      this.checkUsernameTaken.bind(this)
      );
    this.passConfirmControl = this.formBuilder.control('', [
      this.passConfirmValidator.bind(this),
    ]);
    this.signUpForm = this.formBuilder.group({
      username: this.nameControl,
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordConfirm: this.passConfirmControl,
      acceptTosAndRules: [null, [Validators.requiredTrue]],
    });
  }

  userNameValidator({
    value,
  }: AbstractControl): ValidationErrors | null{
    if (value.length < 3) {
      return { usernameTooShort: true };
    }
    if (value.length > 30) {
      return { usernameTooLong: true };
    }
    if (value.includes('@')) {
      return { containsAtSign: true };
    }
    if (value.startsWith('rh.')) {
      return { startsWithRH: true };
    }
    return null;
  }

  checkUsernameTaken(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.joinService.checkUsernameTaken(control.value).pipe(
      map((nameExists: boolean) => {
        if (nameExists) {
          return { usernameTaken: true };
        }
        return null;
      }),
      debounceTime(500)
    );
  }

  passConfirmValidator({ value }: AbstractControl): ValidationErrors | null {
    if (this.signUpForm) {
      if (this.signUpForm.get('password')!!.value !== value) {
        return { passwordsNotMatching: true };
      }
    }
    return null;
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }

    this.joinService
      .register(this.signUpForm.value)
      .pipe(
        map(() => {
          this.joinService
            .login(this.signUpForm.value)
            .pipe(
              map(() => {
                this.joinService
                  .joinRoom(this.joiningRoom)
                  .pipe(
                    map(() => {
                      this.router.navigate(['']);
                    })
                  )
                  .subscribe();
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }
}
