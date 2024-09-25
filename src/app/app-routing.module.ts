import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { BlogComponent } from './components/blog/blog.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { authGuard } from './auth/auth.guard';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

const routes: Routes = [
  {path:'home', component: HomeComponent, canActivate:[authGuard]},
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'profile', component: ProfileComponent, canActivate:[authGuard]},
  {path:'users', component: UsersComponent, canActivate:[authGuard]},
  { path: 'user/:id', component: UserDetailComponent, canActivate:[authGuard]},
  {path:'blog', component: BlogComponent, canActivate:[authGuard]},
  {path:'signin',component:SignInComponent},
  {path:'login',component:LogInComponent},
  {path:'**', redirectTo:'home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
