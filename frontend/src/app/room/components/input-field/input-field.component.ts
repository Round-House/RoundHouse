import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComponentData } from 'src/app/services/plugins/componentData.interface';
import { PluginsService } from 'src/app/services/plugins/plugins.service';
import { RoomService } from '../../services/room/room.service';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  /* Plugin Block Setup Start */
  pluginData: ComponentData[];

  @ViewChild('dynamic', {
    read: ViewContainerRef,
  })
  viewContainerRef!: ViewContainerRef;

  componentLocation: string[] = ['app', 'room', 'inputField'];
  /* Plugin Block Setup End */

  private address: string | undefined = undefined;

  messageForm!: FormGroup;

  inputText = '';

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private pluginsService: PluginsService
  ) {
    this.pluginData = [];
  }

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      text: this.messageForm,
    });
    this.route.queryParams.subscribe((params) => {
      this.address = params['address'];
    });
  }

  ngAfterViewInit(): void {
    this.generatePlugins();
  }

  sendMessage() {
    if (this.inputText.length > 0) {
      this.roomService.createMessage(this.address!!, this.messageForm.value);
      this.messageForm.reset();
      this.inputText = '';
    }
  }

  generatePlugins() {
    this.pluginData = [
      { name: 'address', data: this.address },
      { name: 'messageForm', data: this.messageForm },
    ];
    this.pluginsService.getPlugins(
      this.viewContainerRef,
      this.componentLocation,
      this.pluginData
    );
  }
}
