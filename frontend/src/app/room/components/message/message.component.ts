import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() account: String = "";
  @Input() message: String = "";
  @Input() color: String = "";

  constructor() { }

  ngOnInit(): void {
  }

}
