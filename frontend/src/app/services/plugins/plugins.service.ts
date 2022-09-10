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
  pluginsFile: any;

  constructor() {}

  getPlugins(
    viewContainerRef: ViewContainerRef,
    address: string[],
    componentData: ComponentData[]
  ) {
    var pluginsLocaiton: any;

    try {
      //Get plugins file
      this.pluginsFile = require('/src/assets/plugins.config.json');
      pluginsLocaiton = this.pluginsFile;
      //Go to plugins at specific location
      address.forEach(
        (location: string) => (pluginsLocaiton = pluginsLocaiton[location])
      );
      if (pluginsLocaiton === undefined) {
        throw 'Location does not exest.';
      }
    } catch (error) {
      return;
    }
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
        const component: ComponentRef<any> = viewContainerRef!.createComponent(
          Module[pluignComponent]
        );

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
