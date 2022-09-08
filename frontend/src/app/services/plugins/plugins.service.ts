import {
  loadRemoteModule,
  LoadRemoteModuleOptions,
} from '@angular-architects/module-federation';
import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ComponentData } from './componentData.interface';

declare function require(name: string): any;

@Injectable({
  providedIn: 'root',
})
export class PluginsService {
  hasPlugins: Boolean = true;
  pluginsFile: any;

  constructor() {
    try {
      this.pluginsFile = require('/src/assets/plugins.config.json');
    } catch (error) {
      this.hasPlugins = false;
    }
  }

  getPlugins(
    viewContainerRef: ViewContainerRef,
    componentData: ComponentData[]
  ) {
    if (this.hasPlugins) {
      const modules: any = this.pluginsFile;
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
            viewContainerRef!.createComponent(Module[pluignComponent]);

          componentData.forEach((element: ComponentData) => {
            component.instance[element.name] = element.data;
          });
          viewContainerRef!.insert(component.hostView);
        }
      );
    }
  }
}
