import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';

export const routes: Routes = [
  // Routes publiques
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  
  // Routes protégées
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard], // ✅ Protection ajoutée
    children: [
    { path: 'projects', component: ProjectsComponent },
    { path: 'tasks', component: TasksComponent },
    { path: '', redirectTo: 'projects', pathMatch: 'full' }
  ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
