import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { RoomService } from '../../services/room/room.service';
import { InfiniteScrollingService } from '../../services/infiniteScrolling/infinite-scrolling.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, AfterViewChecked {
  page = 1;
  endLimit: number = 10;

  currentRoom: string | null = this.route.snapshot.queryParamMap.get('address');

  messages: any[] = [];

  scrollAmount: number = 0;
  whiteSpaceHeight: number = 0;
  streamHeight: number = 0;
  finishedSetup: boolean = false;

  username: string = '';
  nextAuthor: any | null = null;
  tempMessage: any | null = null;

  moreMessages = true;
  scrollToBottom = true;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private infiniteScrollingService: InfiniteScrollingService
  ) {}

  ngOnInit(): void {
    // Reset variables on room change
    this.messages = [];
    this.nextAuthor = null;
    this.page = 1;
    this.endLimit = 10;
    this.tempMessage = null;
    this.moreMessages = true;

    // Get username from token to highlight users messages in the stream
    var jwt: any = jwt_decode(localStorage.getItem('local-token')!!);
    this.username = jwt.user.username;

    // Go through first page of messages in the room and add them to the stream
    this.getMessageData(this.page);

    this.infiniteScrollingService.getObservable().subscribe((status) => {
      if (status) {
        this.page = this.page + 1;
        this.endLimit = this.endLimit + 10;
        this.getMessageData(this.page);
      }
    });

    // Refresh the component on address change
    this.route.queryParams.subscribe((params) => {
      if (this.currentRoom != params['address']) {
        this.currentRoom = params['address'];
        this.ngOnInit();
      }
    });
  }

  private getMessageData(page: number) {
    if (this.moreMessages) {
      this.roomService
        .getMessages(this.route.snapshot.queryParams['address'], page)
        .subscribe((response: any) => {
          if (response.messages.items.length == 0) {
            this.moreMessages = false;
            return;
          }
          const messages: any[] = response.messages.items;
          this.messages = messages.reverse().concat(this.messages);
          let clear = setInterval(
            () => {
              let target = document.querySelector(`#target${1}`);
              if (target) {
                clearInterval(clear);
                this.infiniteScrollingService.setObserver().observe(target);
              }
            }
            // , 2000
          );
        });
    }
  }

  private getMoreMessages(page: number): void {
    this.tempMessage = null;
    this.page = page + 1;
    this.roomService
      .getMessages(this.route.snapshot.queryParams['address'], page)
      .pipe(
        map((streamPage: any) => {
          if (page >= streamPage.messages.meta.totalPages) {
            this.moreMessages = false;
          }
          streamPage.messages.items.forEach((message: any) => {
            if (this.tempMessage != null) {
              this.tempMessage.nextAuthor = message.account.username;
              this.messages.unshift(this.tempMessage);
            }
            this.tempMessage = message;
          });
          if (this.tempMessage != null) {
            this.messages.unshift(this.tempMessage);
          }
        })
      )
      .subscribe();
  }

  // If there are less messages then the length of the stream,
  // check for more messages, and if not, add whitespace.
  ngAfterViewChecked() {
    var inner = document.getElementById('inner');
    var streamScroll = document.getElementById('container');

    var whiteSpaceHeight =
      streamScroll!!.offsetHeight - (inner!!.offsetHeight + 80);
    if (whiteSpaceHeight < 0) {
      whiteSpaceHeight = 0;
    }

    this.whiteSpaceHeight = whiteSpaceHeight;

    if (this.scrollToBottom && inner!!.offsetHeight > 0) {
      //this.scrollAmount = streamScroll!!.scrollHeight;
      streamScroll!!.scrollTop = streamScroll!!.scrollHeight;
      this.scrollToBottom = false;
    }
  }
}
