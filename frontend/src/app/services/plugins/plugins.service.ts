import { ComponentType } from '@angular/cdk/portal';
import { Injectable, ViewContainerRef } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class PluginsService {
  private rootViewContainer: ViewContainerRef | undefined;

  constructor() {}

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }
  addDynamicComponent(dynamicComponent: ComponentType<any>) {
    const component = this.rootViewContainer!.createComponent(dynamicComponent);

    this.rootViewContainer!.insert(component.hostView);
  }
}
