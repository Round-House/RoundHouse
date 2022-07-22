import { Component, OnInit } from '@angular/core';
import { SidebarsService } from 'src/app/services/sidebars/sidebars.service';
import { map } from 'rxjs';
import { TreeRoomDto } from 'src/app/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss'],
})
export class LeftBarComponent implements OnInit {
  joinPage = false;

  userRooms: TreeRoomDto[] = [];

  constructor(
    private sidebarService: SidebarsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((url: any) => {
      if (url.url === '/join') {
        this.joinPage = true;
      } else if (url.url === undefined) {
      } else {
        this.joinPage = false;
      }
    });

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
