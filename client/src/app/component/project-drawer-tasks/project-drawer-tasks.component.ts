import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Project } from '../../pages/projects/projects.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskDrawerComponent } from '../task-drawer/task-drawer.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-project-drawer-tasks',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TaskDrawerComponent],
  templateUrl: './project-drawer-tasks.component.html',
  styleUrl: './project-drawer-tasks.component.scss'
})
export class ProjectDrawerTasksComponent {
    @Input() project: Project | null = null;
    @Output() updateProject = new EventEmitter<void>();

    private apiUrl = 'http://localhost:8080/api/task';
    private assignUrl = 'http://localhost:8080/api/task/assign';
    private historyUrl = 'http://localhost:8080/api/task/history';
    showTaskForm = false;
    
    // Pour l'affichage des détails d'une tâche
    selectedTask: Task | null = null;
    isTaskDrawerOpen = false;
    
    // Pour l'assignation des tâches
    currentAssigningTask: Task | null = null;
    showAssignForm = false;
    assignFormData = {
      userEmailToAssign: ''
    };
    
    // Pour la modification des tâches
    currentEditingTask: Task | null = null;
    showEditForm = false;
    editTaskForm = {
      title: '',
      description: '',
      dueDate: '',
      endDate: '',
      priority: '',
      status: ''
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
    
    openTaskDetails(task: Task) {
        // TODO: 
        // - Enlever l'hitorique d'un tache depuis le projet
        // - Récupérer l'historique complet et les affectations avant d'ouvrir le drawer
        this.selectedTask = task;
        this.isTaskDrawerOpen = true;
    }
    
    closeTaskDrawer() {
        this.isTaskDrawerOpen = false;
        this.selectedTask = null;
    }
    
    onTaskUpdated() {
        this.updateProject.emit();
        // TODO: fix le refresh de la tache dans le drawer
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
    
    // Méthodes pour la modification des tâches
    openEditForm(task: Task) {
        this.currentEditingTask = task;
        this.showEditForm = true;
        
        // Initialiser le formulaire avec les valeurs de la tâche
        this.editTaskForm = {
            title: task.title || '',
            description: task.description || '',
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '', // Format YYYY-MM-DD
            endDate: task.endDate ? task.endDate.slice(0, 10) : '',
            priority: task.priority || 'MEDIUM',
            status: task.status || 'BACKLOG'
        };
    }
    
    cancelEditTask() {
        this.showEditForm = false;
        this.currentEditingTask = null;
    }
    
    submitEditTask() {
        if (!this.currentEditingTask) {
            console.error('Aucune tâche sélectionnée');
            return;
        }
        
        const currentUserId = Number(localStorage.getItem('current_userID'));
        
        if (!currentUserId) {
            console.error('Utilisateur non connecté');
            return;
        }
        
        const payload = {
            title: this.editTaskForm.title,
            description: this.editTaskForm.description || null,
            priority: this.editTaskForm.priority,
            status: this.editTaskForm.status,
            dueDate: this.editTaskForm.dueDate || null,
            userRequestingId: currentUserId
        };
        
        this.http.patch(`${this.apiUrl}/${this.currentEditingTask.id}`, payload).subscribe({
            next: () => {
                this.showEditForm = false;
                this.currentEditingTask = null;
                this.updateProject.emit();
                this.toastr.success('Tâche modifiée avec succès');
            },
            error: (err) => {
                console.error('Erreur lors de la modification de la tâche', err);
                if (err.error && err.error.message) {
                    this.toastr.error(err.error.message);
                } else {
                    this.toastr.error('Erreur lors de la modification de la tâche');
                }
            }
        });
    }
}
