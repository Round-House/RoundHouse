import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { JoinService } from '../../service/join.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;

  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private joinService: JoinService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.invalid) {
      return;
    }

    this.joinService
      .login(this.loginForm.value)
      .pipe(
        map(() => {
          this.router.navigate(['']);
        })
      )
      .subscribe();
  }
}
