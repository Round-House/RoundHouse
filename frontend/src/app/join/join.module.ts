import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinRoutingModule } from './join-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { JoinComponent } from './components/join/join.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AboutComponent,
    JoinRoomComponent,
    JoinComponent
  ],
  imports: [
    CommonModule,
    JoinRoutingModule
  ]
})
export class JoinModule { }
