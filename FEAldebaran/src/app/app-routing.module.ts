import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { canActivate } from './routeGuards/authGuard';
import { AdminComponent } from './admin/admin.component';
import { canActivate2 } from './routeGuards/is-admin-guard.guard';

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path: "profile", canActivate: [canActivate] , component: ProfileComponent},
  {path: "admin", canActivate:[canActivate2] , component: AdminComponent},
 
  {path: "users/:id", component: UserComponent},

  {path:"**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
