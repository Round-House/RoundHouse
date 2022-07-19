import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../service/room.service';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  private address: string | undefined = undefined;
  
  messageForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      text: this.messageForm,
    })
    this.route.queryParams.subscribe((params) => {
      this.address = params['address'];
    });
  }

  sendMessage() {
    this.roomService.createMessage(this.address!!, this.messageForm.value);
  }
}
