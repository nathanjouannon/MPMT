import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ProjectDrawerComponent } from '../../component/project-drawer/project-drawer.component';
import { tap } from 'rxjs/operators';

export interface Owner {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;  // date en ISO string
  owner: Owner;
  members: any[]; // type générique, adapter si besoin
  tasks: any[];
  invitations: any[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [DatePipe, HttpClientModule, CommonModule, FormsModule, ProjectDrawerComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  errorMessage = '';
  showCreateForm = false;
  selectedProject: Project | null = null;
  isDrawerOpen = false;

  newProject: {
    name: string;
    description: string;
    start_date: string;
    owner_id: number | null;
  } = {
    name: '',
    description: '',
    start_date: '',
    owner_id: null
  };

  private apiUrl = 'http://localhost:8080/api/project';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjects().subscribe(); 
  }

  loadProjects() {
  this.loading = true;
  return this.http.get<Project[]>(this.apiUrl).pipe(tap({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des projets.';
        this.loading = false;
      }
    }));
  }

  createProject() {
    this.showCreateForm = true;
  }
  cancelCreate() {
    this.showCreateForm = false;
    this.resetFormModel();
  }

  onCreateProject(form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.newProject.name,
      description: this.newProject.description,
      start_date: this.formatDateForApi(this.newProject.start_date),
      owner_id: Number(this.newProject.owner_id)
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.resetFormModel();
        this.showCreateForm = false;
        this.loadProjects().subscribe();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création du projet');
      }
    });
  }

  // helper formatge de date
  private formatDateForApi(dtLocal: string): string {
    if (!dtLocal) return '';
    return dtLocal.length === 16 ? dtLocal + ':00' : dtLocal;
  }

  private resetFormModel() {
    this.newProject = { name: '', description: '', start_date: '', owner_id: null };
  }

  openDrawer(project: Project) {
    this.selectedProject = project;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedProject = null;
  }

  handleProjectUpdated() {
    if (!this.selectedProject) return;
    
    const projectId = this.selectedProject.id;
    
    this.loadProjects().subscribe(() => {
      // Une fois la liste chargée, mettre à jour selectedProject avec la version à jour
      const updatedProject = this.projects.find(p => p.id === projectId);
      if (updatedProject) {
        this.selectedProject = updatedProject;
      }
    });
  }

  onProjectDeleted(deletedProjectId: number) {
    this.loadProjects().subscribe();
    if (this.selectedProject?.id === deletedProjectId) {
      this.closeDrawer();
    }
  }
}
