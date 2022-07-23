import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RoomService } from '../../service/room.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, AfterViewChecked {
  page = 1;

  currentRoom: string | null = this.route.snapshot.queryParamMap.get('address');

  messages: any[] = [];

  scrollAmount: number = 0;

  whiteSpaceHeight: number = 0;

  username: string = '';

  tempMessage: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.messages = [];
    this.tempMessage = null;

    // Get username from token to highlight it in the stream
    var jwt: any = jwt_decode(localStorage.getItem('local-token')!!);
    this.username = jwt.user.username;

    this.roomService
      .getMessages(this.route.snapshot.queryParams['address'], this.page)
      .pipe(
        map((streamPage: any) => {
          streamPage.messages.items.forEach((message: any) => {
            if (this.tempMessage != null) {
              this.tempMessage.nextAuthor = message.account.username;
              this.messages.push(this.tempMessage);
            }
            this.tempMessage = message;
          });
          if (this.tempMessage != null) {
            this.messages.push(this.tempMessage);
          }
        })
      )
      .subscribe();

    this.route.queryParams.subscribe((params) => {
      if (this.currentRoom != params['address']) {
        this.currentRoom = params['address'];
        this.ngOnInit();
      }
    });
  }

  ngAfterViewChecked() {
    var streamScroll = document.getElementById('container');
    this.scrollAmount = streamScroll!!.scrollHeight;
    streamScroll!!.scrollTop = streamScroll!!.scrollHeight;

    var inner = document.getElementById('inner');
    this.whiteSpaceHeight =
      streamScroll!!.offsetHeight - (inner!!.offsetHeight + 80);
    if (this.whiteSpaceHeight < 0) {
      this.whiteSpaceHeight = 0;
    }
  }
}
