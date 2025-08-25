import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Project } from '../../pages/projects/projects.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'RETRO' | 'DONE';
  priority: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  dueDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  assignments?: {
    id: number;
    user: {
      id: number;
      username: string;
      email?: string;
    }
  }[];
}

@Component({
  selector: 'app-project-drawer-tasks',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './project-drawer-tasks.component.html',
  styleUrl: './project-drawer-tasks.component.scss'
})
export class ProjectDrawerTasksComponent {
    @Input() project: Project | null = null;
    @Output() updateProject = new EventEmitter<void>();

    private apiUrl = 'http://localhost:8080/api/task';
    private assignUrl = 'http://localhost:8080/api/task/assign';
    showTaskForm = false;
    
    // Pour l'assignation des tâches
    currentAssigningTask: Task | null = null;
    showAssignForm = false;
    assignFormData = {
      userEmailToAssign: ''
    };
    
    newTask = {
      title: '',
      description: '',
      dueDate: '',
      endDate: '',
      priority: 'MEDIUM',
      status: 'BACKLOG'
    };
    
    statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'RETRO', 'DONE'];
    priorities = ['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];

    constructor(private http: HttpClient, private toastr: ToastrService) {}

    createTask() {
        this.showTaskForm = true;
    }
    
    cancelCreateTask() {
        this.showTaskForm = false;
        this.resetTaskForm();
    }
    
    resetTaskForm() {
        this.newTask = {
            title: '',
            description: '',
            dueDate: '',
            endDate: '',
            priority: 'MEDIUM',
            status: 'BACKLOG'
        };
    }
    
    submitTask() {
        if (!this.project) {
            console.error('Aucun projet sélectionné');
            return;
        }
        
        const currentUserId = Number(localStorage.getItem('current_userID'));
        
        if (!currentUserId) {
            console.error('Utilisateur non connecté');
            return;
        }
        
        const payload = {
            projectId: this.project.id,
            userRequestingId: currentUserId,
            title: this.newTask.title,
            description: this.newTask.description,
            dueDate: this.formatDateForApi(this.newTask.dueDate),
            endDate: this.formatDateForApi(this.newTask.endDate),
            priority: this.newTask.priority,
            status: this.newTask.status
        };
        
        this.http.post(this.apiUrl, payload).subscribe({
            next: () => {
                this.showTaskForm = false;
                this.resetTaskForm();
                this.updateProject.emit();
                this.toastr.success('Tâche créée avec succès');
            },
            error: (err) => {
                console.error('Erreur lors de la création de la tâche', err);
                this.toastr.error('Erreur lors de la création de la tâche');
            }
        });
    }
    
    // Helper pour formater la date correctement pour l'API
    private formatDateForApi(date: string): string | null {
        return date ? date : null;
    }

    getTaskStatusClass(status: string): string {
        switch (status) {
            case 'BACKLOG':
                return 'status-backlog';
            case 'TODO':
                return 'status-todo';
            case 'IN_PROGRESS':
                return 'status-in-progress';
            case 'RETRO':
                return 'status-retro';
            case 'DONE':
                return 'status-done';
            default:
                return '';
        }
    }
    
    getTaskPriorityClass(priority: string): string {
        switch (priority) {
            case 'VERY_LOW':
                return 'priority-very-low';
            case 'LOW':
                return 'priority-low';
            case 'MEDIUM':
                return 'priority-medium';
            case 'HIGH':
                return 'priority-high';
            case 'VERY_HIGH':
                return 'priority-very-high';
            default:
                return '';
        }
    }
    
    // Méthodes pour l'assignation de tâches
    openAssignForm(task: Task) {
        this.currentAssigningTask = task;
        this.showAssignForm = true;
        this.assignFormData = { userEmailToAssign: '' };
    }
    
    cancelAssignTask() {
        this.showAssignForm = false;
        this.currentAssigningTask = null;
        this.assignFormData = { userEmailToAssign: '' };
    }
    
    submitAssignTask() {
        if (!this.currentAssigningTask) {
            console.error('Aucune tâche sélectionnée');
            return;
        }
        
        const currentUserId = Number(localStorage.getItem('current_userID'));
        
        if (!currentUserId) {
            console.error('Utilisateur non connecté');
            return;
        }
        
        if (!this.assignFormData.userEmailToAssign) {
            alert('Veuillez entrer un email');
            return;
        }
        
        const payload = {
            taskId: this.currentAssigningTask.id,
            userRequestingId: currentUserId,
            userEmailToAssign: this.assignFormData.userEmailToAssign
        };
        
        this.http.post(this.assignUrl, payload).subscribe({
            next: () => {
                this.showAssignForm = false;
                this.currentAssigningTask = null;
                this.assignFormData = { userEmailToAssign: '' };
                this.updateProject.emit();
                this.toastr.success('Utilisateur assigné avec succès');
            },
            error: (err) => {
                console.error('Erreur lors de l\'assignation de la tâche', err);
                if (err.error && err.error.message) {
                    this.toastr.error(err.error.message);
                } else {
                    this.toastr.error('Erreur lors de l\'assignation de la tâche');
                }
            }
        });
    }
}
