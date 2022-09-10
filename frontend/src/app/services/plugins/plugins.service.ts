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
    address: string[],
    componentData: ComponentData[]
  ) {
    if (this.hasPlugins) {
      //Get plugins file
      var pluginsLocaiton: any = this.pluginsFile;

      //Go to plugins at specific location
      address.forEach(
        (location: string) => (pluginsLocaiton = pluginsLocaiton[location])
      );

      //Get the plugins at the specified address
      pluginsLocaiton.forEach(
        async (element: { remoteEntry: any; exposedModule: any }) => {
          //Load plugins with Webpack Module Federtion
          const options: LoadRemoteModuleOptions = {
            type: 'module',
            remoteEntry: element.remoteEntry,
            exposedModule: element.exposedModule,
          };
          const Module = await loadRemoteModule(options);

          //Get the componet from the plugin object
          const pluignComponent: any = Object.keys(Module)[0];

          //Create the plugin component inside the called component
          const component: ComponentRef<any> =
            viewContainerRef!.createComponent(Module[pluignComponent]);

          //Add the data to send off to the plugin components
          componentData.forEach((element: ComponentData) => {
            component.instance[element.name] = element.data;
          });

          //Insert plugin component into host component
          viewContainerRef!.insert(component.hostView);
        }
      );
    }
  }
}
