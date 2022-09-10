import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentData } from 'src/app/services/plugins/componentData.interface';
import { PluginsService } from 'src/app/services/plugins/plugins.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements AfterViewInit {
  /* Plugin Block Setup Start */
  pluginData: ComponentData[];

  @ViewChild('dynamic', {
    read: ViewContainerRef,
  })
  viewContainerRef!: ViewContainerRef;

  componentLocation: string[] = ['app', 'room', 'room'];
  /* Plugin Block Setup End */

  constructor(private pluginsService: PluginsService) {
    this.pluginData = [];
  }

  ngAfterViewInit(): void {
    this.generatePlugins();
  }

  generatePlugins() {
    this.pluginData = [];
    this.pluginsService.getPlugins(
      this.viewContainerRef,
      this.componentLocation,
      this.pluginData
    );
  }
}
