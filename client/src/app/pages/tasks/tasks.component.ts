import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskDrawerComponent } from '../../component/task-drawer/task-drawer.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskDrawerComponent, HttpClientModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: { [key: string]: Task[] } = {
    'BACKLOG': [],
    'TODO': [],
    'IN_PROGRESS': [],
    'RETRO': [],
    'DONE': []
  };
  
  statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'RETRO', 'DONE'];
  statusLabels: { [key: string]: string } = {
    'BACKLOG': 'Backlog',
    'TODO': 'À faire',
    'IN_PROGRESS': 'En cours',
    'RETRO': 'Retro',
    'DONE': 'Terminé'
  };
  
  // Pour l'affichage du drawer de tâche
  selectedTask: Task | null = null;
  isTaskDrawerOpen = false;
  
  private apiUrl = 'http://localhost:8080/api/task';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasksByStatus();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches', err);
      }
    });
  }

  filterTasksByStatus(): void {
    // Réinitialiser les tableaux filtrés
    this.statuses.forEach(status => {
      this.filteredTasks[status] = [];
    });
    
    // Filtrer les tâches par statut
    this.tasks.forEach(task => {
      if (this.statuses.includes(task.status)) {
        this.filteredTasks[task.status].push(task);
      }
    });
  }

  openTaskDrawer(task: Task): void {
    this.selectedTask = task;
    this.isTaskDrawerOpen = true;
  }

  closeTaskDrawer(): void {
    this.isTaskDrawerOpen = false;
    this.selectedTask = null;
  }

  onTaskUpdated(): void {
    // Recharger toutes les tâches après une mise à jour
    this.loadTasks();
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
