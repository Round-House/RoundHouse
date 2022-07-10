import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeftBarComponent } from './components/left-bar/left-bar.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';

const routes: Routes = [
  {
    path: 'join',
    loadChildren: () => import('./join/join.module').then(m => m.JoinModule)
  },
  {
    path: 'left',
    component: LeftBarComponent
  },
  {
    path: 'right',
    component: RightBarComponent
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
