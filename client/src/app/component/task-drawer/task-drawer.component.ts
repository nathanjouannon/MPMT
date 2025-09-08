import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-drawer',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './task-drawer.component.html',
  styleUrl: './task-drawer.component.scss'
})
export class TaskDrawerComponent {
  @Input() task: Task | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  editMode = false;
  statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'RETRO', 'DONE'];
  priorities = ['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
  
  editTaskForm = {
    title: '',
    description: '',
    dueDate: '',
    endDate: '',
    priority: '',
    status: ''
  };
  
  // Pour l'assignation de nouvelles personnes
  showAssignForm = false;
  assignFormData = {
    userEmailToAssign: ''
  };

  private apiUrl = 'http://localhost:8080/api/task';
  private assignUrl = 'http://localhost:8080/api/task/assign';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  onBackdropClick() {
    this.close.emit();
  }
  
  editTask() {
    if (!this.task) return;
    this.editMode = true;
    
    // Pré-remplir le formulaire avec les valeurs actuelles
    this.editTaskForm = {
      title: this.task.title || '',
      description: this.task.description || '',
      dueDate: this.task.dueDate ? this.task.dueDate.slice(0, 10) : '', // Format YYYY-MM-DD
      endDate: this.task.endDate ? this.task.endDate.slice(0, 10) : '',
      priority: this.task.priority || 'MEDIUM',
      status: this.task.status || 'BACKLOG'
    };
  }
  
  cancelEdit() {
    this.editMode = false;
  }
  
  submitEditTask() {
    if (!this.task) {
      console.error('Aucune tâche sélectionnée');
      return;
    }
    
    const currentUserId = Number(localStorage.getItem('current_userID'));
    
    if (!currentUserId) {
      console.error('Utilisateur non connecté');
      return;
    }
    
    const payload = {
      taskId: this.task.id,
      userRequestingId: currentUserId,
      title: this.editTaskForm.title,
      description: this.editTaskForm.description,
      dueDate: this.formatDateForApi(this.editTaskForm.dueDate),
      endDate: this.formatDateForApi(this.editTaskForm.endDate),
      priority: this.editTaskForm.priority,
      status: this.editTaskForm.status
    };
    
    this.http.patch(`${this.apiUrl}/${this.task.id}`, payload).subscribe({
      next: () => {
        this.editMode = false;
        this.taskUpdated.emit();
        this.toastr.success('Tâche mise à jour avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la tâche', err);
        this.toastr.error('Erreur lors de la mise à jour de la tâche');
      }
    });
  }
  
  // Fonctions pour l'assignation
  openAssignForm() {
    this.showAssignForm = true;
    this.assignFormData = { userEmailToAssign: '' };
  }
  
  cancelAssignTask() {
    this.showAssignForm = false;
  }
  
  submitAssignTask() {
    if (!this.task) {
      console.error('Aucune tâche sélectionnée');
      return;
    }
    
    const currentUserId = Number(localStorage.getItem('current_userID'));
    
    if (!currentUserId) {
      console.error('Utilisateur non connecté');
      return;
    }
    
    if (!this.assignFormData.userEmailToAssign) {
      this.toastr.error('Veuillez entrer un email');
      return;
    }
    
    const payload = {
      taskId: this.task.id,
      userRequestingId: currentUserId,
      userEmailToAssign: this.assignFormData.userEmailToAssign
    };
    
    this.http.post(this.assignUrl, payload).subscribe({
      next: () => {
        this.showAssignForm = false;
        this.assignFormData = { userEmailToAssign: '' };
        this.taskUpdated.emit();
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
}
