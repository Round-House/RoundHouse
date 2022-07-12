import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './components/room/room.component';
import { LeftRoomBarComponent } from './components/left-room-bar/left-room-bar.component';


@NgModule({
  declarations: [
    RoomComponent,
    LeftRoomBarComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule
  ]
})
export class RoomModule { }
