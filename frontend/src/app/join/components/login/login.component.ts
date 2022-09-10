import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.joinService
      .login(this.loginForm.value)
      .pipe(
        map(() => {
          try {
            if (this.joiningRoom === undefined) {
              throw 'no room to join';
            }
            this.joinService
              .joinRoom(this.joiningRoom!)
              .pipe(
                map(() => {
                  this.router.navigate(['room'], {
                    queryParams: {
                      hub: this.joiningRoom,
                      address: this.joiningRoom,
                    },
                  });
                })
              )
              .subscribe({
                error: (error) => {
                  try {
                    this.router.navigate(['room'], {
                      queryParams: {
                        hub: this.joiningRoom,
                        address: this.joiningRoom,
                      },
                    });
                  } catch (error) {
                    this.router.navigate(['account']);
                  }
                },
              });
          } catch (error) {
            this.router.navigate(['account']);
          }
        })
      )
      .subscribe();
  }
}
