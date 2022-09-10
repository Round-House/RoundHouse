import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentData } from 'src/app/services/plugins/componentData.interface';
import { PluginsService } from 'src/app/services/plugins/plugins.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements AfterViewInit {
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

  componentLocation: string[] = ['app', 'room', 'profilePicture'];
  /* Plugin Block Setup End */

  constructor(private pluginsService: PluginsService) {
    this.pluginData = [];
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
    ];
    this.pluginsService.getPlugins(
      this.viewContainerRef,
      this.componentLocation,
      this.pluginData
    );
  }
}
