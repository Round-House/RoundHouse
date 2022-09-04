import { loadRemoteModule } from '@angular-architects/module-federation';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PluginsService } from 'src/app/services/plugins/plugins.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @ViewChild('dynamic', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef | undefined;

  private pluginsService: any;

  constructor(@Inject(PluginsService) pluginsService: any) {
    this.pluginsService = pluginsService;
  }

  async ngOnInit() {
    const { StatusIconComponent } = await loadRemoteModule({
      remoteEntry: 'http://localhost:4210/remoteEntry.js',
      remoteName: 'status-icon',
      exposedModule: './StatusIconComponent',
    });
    this.pluginsService.setRootViewContainerRef(this.viewContainerRef);
    this.pluginsService.addDynamicComponent(StatusIconComponent);
  }
}
