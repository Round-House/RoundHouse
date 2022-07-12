import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './components/room/room.component';
import { LeftRoomBarComponent } from './components/left-room-bar/left-room-bar.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RoomComponent, LeftRoomBarComponent],
  imports: [
    CommonModule,
    RoomRoutingModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTreeModule,
    MatButtonModule,
  ],
})
export class RoomModule {}
