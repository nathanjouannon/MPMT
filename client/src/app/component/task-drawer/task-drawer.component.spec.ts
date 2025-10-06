import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDrawerComponent } from './task-drawer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskDrawerComponent', () => {
  let component: TaskDrawerComponent;
  let fixture: ComponentFixture<TaskDrawerComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2023-01-01T10:00:00',
    endDate: '2023-01-15T10:00:00',
    createdAt: '2022-12-25T10:00:00',
    assignments: [{
      id: 1,
      user: {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2022-12-01'
      }
    }],
    history: []
  };

  beforeEach(async () => {
    // Créer un spy pour ToastrService
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        TaskDrawerComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDrawerComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('1');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBackdropClick', () => {
    it('should emit close event when backdrop is clicked', () => {
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component.close, 'emit');
      
      // Appeler la méthode à tester
      component.onBackdropClick();
      
      // Vérifier les résultats
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('editTask', () => {
    it('should enter edit mode and initialize form with task data', () => {
      // Appeler la méthode à tester
      component.editTask();
      
      // Vérifier les résultats
      expect(component.editMode).toBeTrue();
      expect(component.editTaskForm).toEqual({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2023-01-01',
        endDate: '2023-01-15',
        priority: 'MEDIUM',
        status: 'TODO'
      });
    });

    it('should do nothing if task is null', () => {
      // Préparer les données
      component.task = null;
      
      // Appeler la méthode à tester
      component.editTask();
      
      // Vérifier les résultats
      expect(component.editMode).toBeFalse();
    });

    it('should handle undefined or empty values gracefully', () => {
      // Préparer les données
      const incompleteTask: Task = {
        id: 2,
        title: '',
        description: undefined as any,
        status: undefined as any,
        priority: undefined as any,
        createdAt: '2023-01-01T10:00:00',
        assignments: [],
        history: []
      };
      
      component.task = incompleteTask;
      
      // Appeler la méthode à tester
      component.editTask();
      
      // Vérifier les résultats
      expect(component.editTaskForm).toEqual({
        title: '',
        description: '',
        dueDate: '',
        endDate: '',
        priority: 'MEDIUM',
        status: 'BACKLOG'
      });
    });
  });

  describe('cancelEdit', () => {
    it('should exit edit mode', () => {
      // Préparer les données
      component.editMode = true;
      
      // Appeler la méthode à tester
      component.cancelEdit();
      
      // Vérifier les résultats
      expect(component.editMode).toBeFalse();
    });
  });

  describe('submitEditTask', () => {
    it('should update task successfully', (done) => {
      // Préparer les données
      component.editMode = true;
      component.editTaskForm = {
        title: 'Updated Title',
        description: 'Updated Description',
        dueDate: '2023-02-01',
        endDate: '2023-03-01',
        priority: 'HIGH',
        status: 'IN_PROGRESS'
      };
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'patch').and.returnValue(of({}));
      spyOn(component.taskUpdated, 'emit');
      
      // Appeler la méthode à tester
      component.submitEditTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(component['http'].patch).toHaveBeenCalledWith(
          'http://localhost:8080/api/task/1', 
          {
            taskId: 1,
            userRequestingId: 1,
            title: 'Updated Title',
            description: 'Updated Description',
            dueDate: '2023-02-01',
            endDate: '2023-03-01',
            priority: 'HIGH',
            status: 'IN_PROGRESS'
          }
        );
        
        expect(component.editMode).toBeFalse();
        expect(component.taskUpdated.emit).toHaveBeenCalled();
        expect(toastrSpy.success).toHaveBeenCalledWith('Tâche mise à jour avec succès');
        done();
      });
    });

    it('should handle error when updating task fails', (done) => {
      // Préparer les données
      component.editMode = true;
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'patch').and.returnValue(throwError(() => new Error('Error updating task')));
      
      // Appeler la méthode à tester
      component.submitEditTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(toastrSpy.error).toHaveBeenCalledWith('Erreur lors de la mise à jour de la tâche');
        done();
      });
    });

    it('should not submit if task is null', () => {
      component.task = null;
      
      spyOn(console, 'error');
      spyOn(component['http'], 'patch');
      
      component.submitEditTask();
      
      expect(console.error).toHaveBeenCalledWith('Aucune tâche sélectionnée');
      expect(component['http'].patch).not.toHaveBeenCalled();
    });

    it('should not submit if user is not logged in', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      
      spyOn(console, 'error');
      spyOn(component['http'], 'patch');
      
      component.submitEditTask();
      
      expect(console.error).toHaveBeenCalledWith('Utilisateur non connecté');
      expect(component['http'].patch).not.toHaveBeenCalled();
    });
  });

  describe('openAssignForm', () => {
    it('should show assign form and reset form data', () => {
      // Préparer les données
      component.showAssignForm = false;
      component.assignFormData.userEmailToAssign = 'old@example.com';
      
      // Appeler la méthode à tester
      component.openAssignForm();
      
      // Vérifier les résultats
      expect(component.showAssignForm).toBeTrue();
      expect(component.assignFormData.userEmailToAssign).toBe('');
    });
  });

  describe('cancelAssignTask', () => {
    it('should hide assign form', () => {
      // Préparer les données
      component.showAssignForm = true;
      
      // Appeler la méthode à tester
      component.cancelAssignTask();
      
      // Vérifier les résultats
      expect(component.showAssignForm).toBeFalse();
    });
  });

  describe('submitAssignTask', () => {
    it('should assign task successfully', (done) => {
      // Préparer les données
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'new@example.com';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'post').and.returnValue(of({}));
      spyOn(component.taskUpdated, 'emit');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(component['http'].post).toHaveBeenCalledWith(
          'http://localhost:8080/api/task/assign', 
          {
            taskId: 1,
            userRequestingId: 1,
            userEmailToAssign: 'new@example.com'
          }
        );
        
        expect(component.showAssignForm).toBeFalse();
        expect(component.assignFormData.userEmailToAssign).toBe('');
        expect(component.taskUpdated.emit).toHaveBeenCalled();
        expect(toastrSpy.success).toHaveBeenCalledWith('Utilisateur assigné avec succès');
        done();
      });
    });

    it('should handle error when assigning task fails with specific message', (done) => {
      // Préparer les données
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'new@example.com';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      const error = { error: { message: 'Utilisateur non trouvé' } };
      spyOn(component['http'], 'post').and.returnValue(throwError(() => error));
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(toastrSpy.error).toHaveBeenCalledWith('Utilisateur non trouvé');
        done();
      });
    });

    it('should handle error when assigning task fails without specific message', (done) => {
      // Préparer les données
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'new@example.com';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      const error = { status: 500 };
      spyOn(component['http'], 'post').and.returnValue(throwError(() => error));
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(toastrSpy.error).toHaveBeenCalledWith('Erreur lors de l\'assignation de la tâche');
        done();
      });
    });

    it('should not submit if task is null', () => {
      // Préparer les données
      component.task = null;
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'post');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats
      expect(console.error).toHaveBeenCalledWith('Aucune tâche sélectionnée');
      expect(component['http'].post).not.toHaveBeenCalled();
    });

    it('should not submit if user is not logged in', () => {
      // Préparer les données
        (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'post');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats
      expect(console.error).toHaveBeenCalledWith('Utilisateur non connecté');
      expect(component['http'].post).not.toHaveBeenCalled();
    });

    it('should not submit if no email is provided', () => {
      // Préparer les données
      component.assignFormData.userEmailToAssign = '';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'post');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats
      expect(toastrSpy.error).toHaveBeenCalledWith('Veuillez entrer un email');
      expect(component['http'].post).not.toHaveBeenCalled();
    });
  });

  describe('formatDateForApi', () => {
    it('should return date string if provided', () => {
      // Obtenir la méthode privée
      const result = component['formatDateForApi']('2023-01-01');
      
      // Vérifier les résultats
      expect(result).toBe('2023-01-01');
    });

    it('should return null if date string is empty', () => {
      // Obtenir la méthode privée
      const result = component['formatDateForApi']('');
      
      // Vérifier les résultats
      expect(result).toBeNull();
    });
  });

  describe('getTaskStatusClass', () => {
    it('should return correct CSS class for each status', () => {
      expect(component.getTaskStatusClass('BACKLOG')).toBe('status-backlog');
      expect(component.getTaskStatusClass('TODO')).toBe('status-todo');
      expect(component.getTaskStatusClass('IN_PROGRESS')).toBe('status-in-progress');
      expect(component.getTaskStatusClass('RETRO')).toBe('status-retro');
      expect(component.getTaskStatusClass('DONE')).toBe('status-done');
      expect(component.getTaskStatusClass('UNKNOWN')).toBe('');
    });
  });

  describe('getTaskPriorityClass', () => {
    it('should return correct CSS class for each priority', () => {
      expect(component.getTaskPriorityClass('VERY_LOW')).toBe('priority-very-low');
      expect(component.getTaskPriorityClass('LOW')).toBe('priority-low');
      expect(component.getTaskPriorityClass('MEDIUM')).toBe('priority-medium');
      expect(component.getTaskPriorityClass('HIGH')).toBe('priority-high');
      expect(component.getTaskPriorityClass('VERY_HIGH')).toBe('priority-very-high');
      expect(component.getTaskPriorityClass('UNKNOWN')).toBe('');
    });
  });
});