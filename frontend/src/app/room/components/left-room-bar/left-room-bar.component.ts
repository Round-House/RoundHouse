import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { TreeRoomDto } from 'src/app/models';
import { RoomService } from '../../service/room.service';
import { RoomDto } from '../models/room.dto';

@Component({
  selector: 'app-left-room-bar',
  templateUrl: './left-room-bar.component.html',
  styleUrls: ['./left-room-bar.component.scss'],
})
export class LeftRoomBarComponent implements OnInit {
  treeControl = new NestedTreeControl<RoomDto>((node) => node.childRooms);
  dataSource = new MatTreeNestedDataSource<RoomDto>();

  roomTree: RoomDto[] | undefined;

  roomName: string | undefined;

  constructor(private route: ActivatedRoute, private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getRoomTree(
      this.route.snapshot.queryParams['address']
    ).pipe(
      map((rooms: RoomDto) => {
        this.roomName = rooms.name;
        if(rooms.childRooms){
          this.roomTree = rooms.childRooms;
          this.dataSource.data = this.roomTree;
        }
      }
    )
    ).subscribe();
  }

  hasChild = (_: number, node: RoomDto) =>
    !!node.childRooms && node.childRooms.length > 0;
}
