import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './components/account/account.component';
import { PluginsService } from '../services/plugins/plugins.service';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, AccountRoutingModule],
  providers: [PluginsService],
})
export class AccountModule {}
