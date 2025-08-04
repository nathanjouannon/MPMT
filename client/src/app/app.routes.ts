import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    // Routes publiques
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },

    // Routes protégées
    // {
    // path: 'dashboard',
    // loadChildren: () =>
    //   import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    //   canActivate: [AuthGuard],
    // },

    // Redirection si route inconnue
    { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
