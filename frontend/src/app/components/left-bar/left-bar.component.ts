import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SidebarsService } from 'src/app/services/sidebars.service';
import { map } from 'rxjs';
import { TreeRoomDto } from 'src/app/models';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss'],
})
export class LeftBarComponent implements OnInit {
  
  joinPage = false;

  rooms: TreeRoomDto | undefined;

  userRooms: TreeRoomDto[] = [];

  constructor(
    private location: Location,
    private sidebarService: SidebarsService
  ) {}

  ngOnInit(): void {
    this.location.path() === '/join'
      ? (this.joinPage = true)
      : (this.joinPage = false);

    this.sidebarService
      .getUserTree()
      .pipe(
        map((rooms: any) => {
          rooms.forEach((element: TreeRoomDto) => {
            element.color = { backgroundColor: element.color };
            this.userRooms.push(element);
          });
          return this.userRooms;
        })
      )
      .subscribe();
  }
}
