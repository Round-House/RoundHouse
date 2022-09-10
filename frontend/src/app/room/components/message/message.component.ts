import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentData } from 'src/app/services/plugins/componentData.interface';
import { PluginsService } from 'src/app/services/plugins/plugins.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  @Input() account: String = '';
  @Input() message: String = '';
  @Input() color: String = '';
  @Input() viewer: String = '';
  @Input() nextAuthor: String = '';
  @Input() createdAt: string = '0';

  /* Plugin Block Setup Start */
  pluginData: ComponentData[];

  @ViewChild('dynamic', {
    read: ViewContainerRef,
  })
  viewContainerRef!: ViewContainerRef;

  componentLocation: string[] = ['app', 'room', 'message'];
  /* Plugin Block Setup End */

  background: String = '';
  repeatAuthor: boolean = false;

  constructor(private pluginsService: PluginsService) {
    this.pluginData = [];
  }

  ngOnInit(): void {
    if (this.account == this.viewer) {
      this.background = '#0000001b';
    }

    if (this.nextAuthor == this.account) {
      this.repeatAuthor = true;
    }
  }

  ngAfterViewInit(): void {
    this.generatePlugins();
  }

  generatePlugins() {
    this.pluginData = [
      { name: 'account', data: this.account },
      { name: 'message', data: this.message },
      { name: 'color', data: this.color },
      { name: 'viewer', data: this.viewer },
      { name: 'nextAuthor', data: this.nextAuthor },
      { name: 'createdAt', data: this.createdAt },
      { name: 'background', data: this.background },
      { name: 'repeatAuthor', data: this.repeatAuthor },
    ];

    this.pluginsService.getPlugins(
      this.viewContainerRef,
      this.componentLocation,
      this.pluginData
    );
  }
}
