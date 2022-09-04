import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';

import { RoomComponent } from './components/room/room.component';
import { LeftRoomBarComponent } from './components/left-room-bar/left-room-bar.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { MessageComponent } from './components/message/message.component';
import { StreamComponent } from './components/stream/stream.component';
import { UsersComponent } from './components/users/users.component';
import { InfoComponent } from './components/info/info.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';

@NgModule({
  declarations: [
    RoomComponent,
    LeftRoomBarComponent,
    InputFieldComponent,
    MessageComponent,
    StreamComponent,
    UsersComponent,
    InfoComponent,
    ProfilePictureComponent,
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTreeModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RoomModule {}
