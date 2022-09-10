import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { RoomService } from '../../services/room/room.service';
import { InfiniteScrollingService } from '../../services/infiniteScrolling/infinite-scrolling.service';
import { ComponentData } from 'src/app/services/plugins/componentData.interface';
import { PluginsService } from 'src/app/services/plugins/plugins.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, AfterViewChecked {
  /* Plugin Block Setup Start */
  pluginData: ComponentData[];

  @ViewChild('dynamic', {
    read: ViewContainerRef,
  })
  viewContainerRef!: ViewContainerRef;

  componentLocation: string[] = ['app', 'room', 'stream'];
  /* Plugin Block Setup End */

  currentRoom: string | null = this.route.snapshot.queryParamMap.get('address');

  messages: any[] = [];

  // Logic for viewing stream
  whiteSpaceHeight: number = 0;
  streamHeight: number = 0;
  finishedSetup: boolean = false;
  moreMessages = true;
  scrollToBottom = true;
  gettingMessages = false;

  // Variables for highlighting users messages
  username: string = '';
  nextAuthor: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private infiniteScrollingService: InfiniteScrollingService,
    private pluginsService: PluginsService
  ) {
    this.pluginData = [];
  }

  ngOnInit(): void {
    // Reset variables on room change
    this.messages = [];
    this.nextAuthor = null;
    this.moreMessages = true;
    this.scrollToBottom = true;
    this.whiteSpaceHeight = 0;

    // Get username from token to highlight users messages in the stream
    var jwt: any = jwt_decode(localStorage.getItem('local-token')!!);
    this.username = jwt.user.username;

    // Go through first page of messages in the room and add them to the stream
    this.getMessageData();

    // Then, if at the top of the stream, check for more messages
    this.infiniteScrollingService.getObservable().subscribe((status) => {
      if (status && !this.gettingMessages) {
        this.nextAuthor = null;
        this.getMessageData();
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

  ngAfterViewInit(): void {
    this.generatePlugins();
  }

  ngAfterViewChecked() {
    var inner = document.getElementById('inner');
    var streamScroll = document.getElementById('container');

    // If there are less messages then the hight of the screen, add whitespace
    if (
      !this.moreMessages &&
      streamScroll!!.scrollHeight <= streamScroll!!.clientHeight
    ) {
      var whiteSpaceHeight =
        streamScroll!!.offsetHeight - (inner!!.offsetHeight + 80);
      if (whiteSpaceHeight < 0) {
        whiteSpaceHeight = 0;
      }

      this.whiteSpaceHeight = whiteSpaceHeight;
    }

    // On first load, go to the bottom of the stream
    if (
      this.scrollToBottom &&
      streamScroll!!.scrollHeight > streamScroll!!.clientHeight &&
      !this.gettingMessages
    ) {
      streamScroll!!.scrollTop = streamScroll!!.scrollHeight;
      this.scrollToBottom = false;
    }
  }

  // Get the messages from the room
  private getMessageData() {
    // Helps load one page of messages at a time
    this.gettingMessages = true;

    // Get the messages created directly before the last message
    var lastTimestamp: Date = this.messages[0]
      ? new Date(Date.parse(this.messages[0].createdAt))
      : new Date(Math.round(Number.MAX_SAFE_INTEGER / 1000));

    // Don't hit the server if there are no more messages
    if (this.moreMessages) {
      this.roomService
        .getMessages(
          this.route.snapshot.queryParams['address'],
          lastTimestamp.getTime()
        )
        .subscribe((response: any) => {
          // If there are no more messages, set the flag to false and return
          if (response.messages.length == 0) {
            this.moreMessages = false;
            this.gettingMessages = false;
            return;
          }

          // Add the messages to the stream
          var messages: any[] = response.messages.reverse();

          messages.forEach((message: any) => {
            message.nextAuthor = this.nextAuthor;
            this.nextAuthor = message.account.username;
          });

          this.messages = messages.concat(this.messages);

          // Set a flag for when the user sees the top message
          let clear = setInterval(() => {
            let target = document.querySelector(`#target${1}`);
            if (target) {
              clearInterval(clear);
              this.infiniteScrollingService.setObserver().observe(target);
            }
          });

          // Messages are loaded, so set the flag to false
          this.gettingMessages = false;

          // Keep the scroll bar at the current message being viewed
          var streamScroll = document.getElementById('container');
          streamScroll!!.scrollTop = 1;
        });
    }
  }

  generatePlugins() {
    this.pluginData = [
      { name: 'currentRoom', data: this.currentRoom },
      { name: 'messages', data: this.messages },
      { name: 'whiteSpaceHeight', data: this.whiteSpaceHeight },
      { name: 'finishedSetup', data: this.finishedSetup },
      { name: 'moreMessages', data: this.moreMessages },
      { name: 'scrollToBottom', data: this.scrollToBottom },
      { name: 'gettingMessages', data: this.gettingMessages },
      { name: 'username', data: this.username },
      { name: 'nextAuthor', data: this.nextAuthor },
    ];

    this.pluginsService.getPlugins(
      this.viewContainerRef,
      this.componentLocation,
      this.pluginData
    );
  }
}
