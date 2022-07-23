import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() account: String = '';
  @Input() message: String = '';
  @Input() color: String = '';
  @Input() viewer: String = '';
  @Input() nextAuthor: String = '';

  background: String = '';
  repeatAuthor: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.account == this.viewer) {
      this.background = '#0000001b';
    }

    if (this.nextAuthor == this.account) {
      this.repeatAuthor = true;
    }
  }
}
