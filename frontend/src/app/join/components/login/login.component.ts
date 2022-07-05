import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  email = new FormControl('', [Validators.required]);

  password = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit(): void {
  }


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must fill this field';
    }
    if (this.password.hasError('required')) {
      return 'You must fill this field';
    }

    return 'Unknown error';
  }

}
