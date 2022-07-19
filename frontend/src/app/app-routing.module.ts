import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
  },
  {
    path: 'following',
    loadChildren: () => import('./following/following.module').then(m => m.FollowingModule)
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.module').then(m => m.RoomModule)
  },
  {
    path: 'join',
    loadChildren: () => import('./join/join.module').then(m => m.JoinModule)
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
