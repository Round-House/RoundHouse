import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';;

import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { LeftBarComponent } from './components/left-bar/left-bar.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './components/main/main.component';


@NgModule({
  declarations: [
    MainComponent,
    LeftBarComponent,
    RightBarComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule
  ],
})
export class MainModule { }
