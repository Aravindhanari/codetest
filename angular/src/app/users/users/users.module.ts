import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRouting } from './users-routing.module';
import { UsersComponent } from './users.component';
// import { MyTableComponent } from './../../directives/my-table/my-table.component';


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,

    UserRouting
  ]
})
export class UsersModule { }
