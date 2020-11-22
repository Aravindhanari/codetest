import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { ListuserComponent } from './../listuser/listuser.component';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })

const UserRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: '',
    component: UsersComponent,
    children: [
        // {
        //     path: 'roles',
        //     component: RolesComponent
        // },
        // {
        //     path: 'quote-format',
        //     component: QuoteFormatListComponent,
        // },
        {
            path: 'list',
            component: ListuserComponent
        },
    ]
  }
]
// export class UsersRoutingModule { }
export const UserRouting = RouterModule.forChild(UserRoutes);
