import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs';
import { RoomService } from '../../services/room/room.service';
import { RoomDto } from '../../models/room.dto';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-left-room-bar',
  templateUrl: './left-room-bar.component.html',
  styleUrls: ['./left-room-bar.component.scss'],
})
export class LeftRoomBarComponent implements OnInit {
  treeControl = new NestedTreeControl<RoomDto>((node) => node.childRooms);
  dataSource = new MatTreeNestedDataSource<RoomDto>();

  roomTree: RoomDto[] | undefined;

  rootRoomAddress: string | undefined;

  rootRoomName: string | undefined;

  currentRoom: string | undefined;

  param: string | null = this.route.snapshot.queryParamMap.get('hub');

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.roomService
      .getRoomTree(this.route.snapshot.queryParams['hub'])
      .pipe(
        map((rooms: RoomDto) => {
          this.rootRoomName = rooms.name;
          this.rootRoomAddress = rooms.roomAddress;
          this.currentRoom = rooms.roomAddress;
          if (rooms.childRooms) {
            this.roomTree = rooms.childRooms;
            this.dataSource.data = this.roomTree;
          }
          this.titleService.setTitle(rooms.name!!);
        })
      )
      .subscribe();
    this.route.queryParams.subscribe((params) => {
      if (this.param != params['hub']) {
        this.param = params['hub'];
        this.ngOnInit();
      }
    });
  }

  changeRoom(address: string) {
    this.currentRoom = address;
    const queryParams: Params = { address: address };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  roomSelected(address: string) {
    return address === this.currentRoom;
  }

  hasChild = (_: number, node: RoomDto) =>
    !!node.childRooms && node.childRooms.length > 0;
}
