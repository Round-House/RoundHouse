import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RoomCardDto } from '../../models/room-card.dto';
import { JoinService } from '../../service/join.service';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent implements OnInit {
  removed = true;

  roomName: string | undefined = undefined;

  roomAddress: string | undefined = undefined;

  roomDescription: string | undefined = undefined;

  roomImage: string | undefined = undefined;

  constructor(private route: ActivatedRoute, private joinService: JoinService) {
    this.joinService.isJoiningRoom(this.roomAddress);
  }

  ngOnInit(): void {
    this.joinService
      .getRoom(this.route.snapshot.queryParams['room'])
      .pipe(
        map((room: RoomCardDto) => {
          if (room) {
            this.removed = false;
            this.joinService.isJoiningRoom(room.roomAddress);
            this.roomName = room.name;
            this.roomAddress = '@' + room.roomAddress;
            this.roomDescription = room.description;
            this.roomImage = room.image;
          }
        })
      )
      .subscribe();
  }

  removeRoom() {
    this.removed = true;
    this.joinService.isJoiningRoom(undefined);
  }
}
