import {
  loadRemoteModule,
  LoadRemoteModuleOptions,
} from '@angular-architects/module-federation';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
//import * as pluginsFile from 'src/assets/plugins.config.json';

declare function require(name: string): any;

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

  @ViewChild('dynamic', {
    read: ViewContainerRef,
  })
  viewContainerRef: ViewContainerRef | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    this.getPlugins();
  }

  private getPlugins() {
    try {
      const pluginsFile = require('/src/assets/plugins.config.json');
      const modules: any = pluginsFile;
      modules.app.room.profilePicture.forEach(
        async (element: { remoteEntry: any; exposedModule: any }) => {
          const options: LoadRemoteModuleOptions = {
            type: 'module',
            remoteEntry: element.remoteEntry,
            exposedModule: element.exposedModule,
          };
          const Module = await loadRemoteModule(options);
          const pluignComponent: any = Object.keys(Module)[0];
          const component: ComponentRef<any> =
            this.viewContainerRef!.createComponent(Module[pluignComponent]);
          component.instance.account = this.account;
          component.instance.message = this.message;
          component.instance.color = this.color;
          component.instance.viewer = this.viewer;
          component.instance.nextAuthor = this.nextAuthor;
          component.instance.createdAt = this.createdAt;
          this.viewContainerRef!.insert(component.hostView);
        }
      );
    } catch (error) {}
  }
}
