import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// admin views

import { SettingsComponent } from "./views/admin/settings/settings.component";
import { TablesComponent } from "./views/admin/tables/tables.component";
import { ManagerComponent } from "./views/admin/manager/manager.component";
import { DeveloperComponent } from "./views/admin/developer/developer.component";
import { UsersComponent } from './views/admin/users/users.component';

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";

// no layouts views
import { IndexComponent } from "./views/index/index.component";
import { LandingComponent } from "./views/landing/landing.component";
import { ProfileComponent } from "./views/profile/profile.component";



const routes: Routes = [
  // admin views
  {
    path: "dashboard",
    component: AdminComponent,
    children: [
      { path: "users", component:  UsersComponent},
      { path: "adminsitraotor", component: SettingsComponent },
      { path: "admin", component: TablesComponent },
      { path: "manager", component: ManagerComponent },
      { path: "developer", component: DeveloperComponent },
      { path: "", redirectTo: "admin", pathMatch: "full" },
      // {path:'', component: TablesComponent}
    ],
  },
  // auth views
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
  // no layout views
  { path: "profile", component: ProfileComponent },
  { path: "landing", component: LandingComponent },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
