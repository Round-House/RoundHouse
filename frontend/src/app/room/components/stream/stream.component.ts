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

  tempAuthor: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    // Reset variables on room change
    this.messages = [];
    this.tempAuthor = null;

    // Get username from token to highlight users messages in the stream
    var jwt: any = jwt_decode(localStorage.getItem('local-token')!!);
    this.username = jwt.user.username;

    // Go through all messages in the room and add them to the stream
    this.roomService
      .getMessages(this.route.snapshot.queryParams['address'], this.page)
      .pipe(
        map((streamPage: any) => {
          var messages: any[] = streamPage.messages.items;

          messages = messages.reverse();

          messages.forEach((message: any) => {
            message.nextAuthor = this.tempAuthor;
            this.messages.push(message);
            this.tempAuthor = message.account.username;
          });
        })
      )
      .subscribe();

    // Refresh the component on address change
    this.route.queryParams.subscribe((params) => {
      if (this.currentRoom != params['address']) {
        this.currentRoom = params['address'];
        this.ngOnInit();
      }
    });
  }

  // If there are less messages then the length of the stream, add whitespace.
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
