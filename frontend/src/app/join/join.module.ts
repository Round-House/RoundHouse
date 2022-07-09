import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinRoutingModule } from './join-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { JoinComponent } from './components/join/join.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input'; 
import {MatButtonModule} from '@angular/material/button';
import { StatsComponent } from './components/stats/stats.component';
import { BottomCardComponent } from './components/bottom-card/bottom-card.component'; 
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AboutComponent,
    JoinRoomComponent,
    JoinComponent,
    StatsComponent,
    BottomCardComponent,
  ],
  imports: [
    CommonModule,
    JoinRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,
  ],
})
export class JoinModule {}
