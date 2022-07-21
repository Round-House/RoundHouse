import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, AfterViewChecked {

  page = 1;

  currentRoom: string | null = this.route.snapshot.queryParamMap.get('address');

  messages: any[] = [];

  myScrollVariable: number = 0;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {

    this.messages = [];

    this.roomService
      .getMessages(this.route.snapshot.queryParams['address'], this.page)
      .pipe(
        map((streamPage: any) => {
          streamPage.messages.items.forEach((message: any) => {
            this.messages.push(message);
          });
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
    var streamScroll = document.getElementById("container");
    this.myScrollVariable = streamScroll!!.scrollHeight;
    streamScroll!!.scrollTop = streamScroll!!.scrollHeight; 
} 
}
