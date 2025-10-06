import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDrawerTasksComponent } from './project-drawer-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';

describe('ProjectDrawerTasksComponent', () => {
  let component: ProjectDrawerTasksComponent;
  let fixture: ComponentFixture<ProjectDrawerTasksComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2023-01-01T10:00:00',
    createdAt: '2023-01-01T10:00:00',
    assignments: [{
      id: 1,
      user: {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2023-01-01'
      }
    }],
    history: []
  };

  const mockProject = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    startDate: '2023-01-01',
    owner: {
      id: 1,
      username: 'owner',
      email: 'owner@example.com',
      createdAt: '2023-01-01'
    },
    members: [],
    tasks: [mockTask],
    invitations: []
  };

  beforeEach(async () => {
    // Créer un spy pour ToastrService
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    
    await TestBed.configureTestingModule({
      imports: [
        ProjectDrawerTasksComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDrawerTasksComponent);
    component = fixture.componentInstance;
    component.project = mockProject;
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('1');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createTask', () => {
    it('should toggle task form visibility when createTask is called', () => {
      expect(component.showTaskForm).toBeFalse();
      component.createTask();
      expect(component.showTaskForm).toBeTrue();
    });
  });

  describe('cancelCreateTask', () => {
    it('should hide form and reset when cancelCreateTask is called', () => {
      component.showTaskForm = true;
      component.newTask.title = 'Test Title';
      
      component.cancelCreateTask();
      
      expect(component.showTaskForm).toBeFalse();
      expect(component.newTask.title).toBe('');
    });
  });

  describe('submitTask', () => {
    it('should create task successfully', (done) => {
      // Préparer les données
      component.showTaskForm = true;
      component.newTask = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2023-01-15',
        endDate: '',
        priority: 'HIGH',
        status: 'TODO'
      };
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'post').and.returnValue(of({}));
      spyOn(component.updateProject, 'emit');
      
      // Appeler la méthode à tester
      component.submitTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(component['http'].post).toHaveBeenCalledWith('http://localhost:8080/api/task', {
          projectId: 1,
          userRequestingId: 1,
          title: 'New Task',
          description: 'New Description',
          dueDate: '2023-01-15',
          endDate: null,
          priority: 'HIGH',
          status: 'TODO'
        });
        
        expect(component.updateProject.emit).toHaveBeenCalled();
        expect(toastrSpy.success).toHaveBeenCalledWith('Tâche créée avec succès');
        expect(component.showTaskForm).toBeFalse();
        done();
      });
    });

    it('should handle error when creating task fails', (done) => {
      // Préparer les données
      component.showTaskForm = true;
      component.newTask = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '',
        endDate: '',
        priority: 'HIGH',
        status: 'TODO'
      };
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'post').and.returnValue(throwError(() => new Error('Error')));
      
      // Appeler la méthode à tester
      component.submitTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(toastrSpy.error).toHaveBeenCalledWith('Erreur lors de la création de la tâche');
        done();
      });
    });

    it('should not submit task when project is null', () => {
      // Préparer les données
      component.project = null;
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'post');
      
      // Appeler la méthode à tester
      component.submitTask();
      
      // Vérifier les résultats
      expect(console.error).toHaveBeenCalledWith('Aucun projet sélectionné');
      expect(component['http'].post).not.toHaveBeenCalled();
    });
  });

  describe('getTaskStatusClass', () => {
    it('should return correct CSS class based on task status', () => {
      expect(component.getTaskStatusClass('BACKLOG')).toBe('status-backlog');
      expect(component.getTaskStatusClass('TODO')).toBe('status-todo');
      expect(component.getTaskStatusClass('IN_PROGRESS')).toBe('status-in-progress');
      expect(component.getTaskStatusClass('RETRO')).toBe('status-retro');
      expect(component.getTaskStatusClass('DONE')).toBe('status-done');
      expect(component.getTaskStatusClass('UNKNOWN')).toBe('');
    });
  });

  describe('getTaskPriorityClass', () => {
    it('should return correct CSS class based on task priority', () => {
      expect(component.getTaskPriorityClass('VERY_LOW')).toBe('priority-very-low');
      expect(component.getTaskPriorityClass('LOW')).toBe('priority-low');
      expect(component.getTaskPriorityClass('MEDIUM')).toBe('priority-medium');
      expect(component.getTaskPriorityClass('HIGH')).toBe('priority-high');
      expect(component.getTaskPriorityClass('VERY_HIGH')).toBe('priority-very-high');
      expect(component.getTaskPriorityClass('UNKNOWN')).toBe('');
    });
  });

  describe('openTaskDetails', () => {
    it('should open task details', () => {
      component.openTaskDetails(mockTask);
      expect(component.selectedTask).toBe(mockTask);
      expect(component.isTaskDrawerOpen).toBeTrue();
    });
  });

  describe('closeTaskDrawer', () => {
    it('should close task drawer', () => {
      // Préparer les données
      component.selectedTask = mockTask;
      component.isTaskDrawerOpen = true;
      
      // Appeler la méthode à tester
      component.closeTaskDrawer();
      
      // Vérifier les résultats
      expect(component.selectedTask).toBeNull();
      expect(component.isTaskDrawerOpen).toBeFalse();
    });
  });

  describe('onTaskUpdated', () => {
    it('should emit update when onTaskUpdated is called', () => {
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component.updateProject, 'emit');
      
      // Appeler la méthode à tester
      component.onTaskUpdated();
      
      // Vérifier les résultats
      expect(component.updateProject.emit).toHaveBeenCalled();
    });
  });

  describe('openAssignForm', () => {
    it('should open assign form for a task', () => {
      component.openAssignForm(mockTask);
      expect(component.currentAssigningTask).toBe(mockTask);
      expect(component.showAssignForm).toBeTrue();
      expect(component.assignFormData.userEmailToAssign).toBe('');
    });
  });

  describe('cancelAssignTask', () => {
    it('should cancel task assignment', () => {
      // Préparer les données
      component.currentAssigningTask = mockTask;
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'test@example.com';
      
      // Appeler la méthode à tester
      component.cancelAssignTask();
      
      // Vérifier les résultats
      expect(component.currentAssigningTask).toBeNull();
      expect(component.showAssignForm).toBeFalse();
      expect(component.assignFormData.userEmailToAssign).toBe('');
    });
  });

  describe('submitAssignTask', () => {
    it('should assign task successfully', (done) => {
      // Préparer les données
      component.currentAssigningTask = mockTask;
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'test@example.com';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'post').and.returnValue(of({}));
      spyOn(component.updateProject, 'emit');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(component['http'].post).toHaveBeenCalledWith('http://localhost:8080/api/task/assign', {
          taskId: 1,
          userRequestingId: 1,
          userEmailToAssign: 'test@example.com'
        });
        
        expect(toastrSpy.success).toHaveBeenCalledWith('Utilisateur assigné avec succès');
        expect(component.updateProject.emit).toHaveBeenCalled();
        expect(component.showAssignForm).toBeFalse();
        done();
      });
    });

    it('should handle error when assigning task fails', (done) => {
      // Préparer les données
      component.currentAssigningTask = mockTask;
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'test@example.com';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      const error = { error: { message: 'User not found' } };
      spyOn(component['http'], 'post').and.returnValue(throwError(() => error));
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(toastrSpy.error).toHaveBeenCalledWith('User not found');
        done();
      });
    });

    it('should handle error without message when assigning task fails', (done) => {
      // Préparer les données
      component.currentAssigningTask = mockTask;
      component.showAssignForm = true;
      component.assignFormData.userEmailToAssign = 'test@example.com';
      
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

    it('should not submit assign task when no task is selected', () => {
      // Préparer les données
      component.currentAssigningTask = null;
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'post');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats
      expect(console.error).toHaveBeenCalledWith('Aucune tâche sélectionnée');
      expect(component['http'].post).not.toHaveBeenCalled();
    });

    it('should not submit assign task when no email is provided', () => {
      // Préparer les données
      component.currentAssigningTask = mockTask;
      component.assignFormData.userEmailToAssign = '';
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(window, 'alert');
      spyOn(component['http'], 'post');
      
      // Appeler la méthode à tester
      component.submitAssignTask();
      
      // Vérifier les résultats
      expect(window.alert).toHaveBeenCalledWith('Veuillez entrer un email');
      expect(component['http'].post).not.toHaveBeenCalled();
    });
  });

  describe('openEditForm', () => {
    it('should open edit form for a task', () => {
      // Appeler la méthode à tester
      component.openEditForm(mockTask);
      
      // Vérifier les résultats
      expect(component.currentEditingTask).toBe(mockTask);
      expect(component.showEditForm).toBeTrue();
      expect(component.editTaskForm.title).toBe('Test Task');
      expect(component.editTaskForm.description).toBe('Test Description');
    });
  });

  describe('cancelEditTask', () => {
    it('should cancel task editing', () => {
      // Préparer les données
      component.currentEditingTask = mockTask;
      component.showEditForm = true;
      
      // Appeler la méthode à tester
      component.cancelEditTask();
      
      // Vérifier les résultats
      expect(component.currentEditingTask).toBeNull();
      expect(component.showEditForm).toBeFalse();
    });
  });

  describe('submitEditTask', () => {
    it('should edit task successfully', (done) => {
      // Préparer les données
      component.currentEditingTask = mockTask;
      component.showEditForm = true;
      component.editTaskForm = {
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: '2023-01-15',
        endDate: '',
        priority: 'HIGH',
        status: 'IN_PROGRESS'
      };
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'patch').and.returnValue(of({}));
      spyOn(component.updateProject, 'emit');
      
      // Appeler la méthode à tester
      component.submitEditTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(component['http'].patch).toHaveBeenCalledWith('http://localhost:8080/api/task/1', {
          title: 'Updated Task',
          description: 'Updated Description',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          dueDate: '2023-01-15',
          userRequestingId: 1
        });
        
        expect(toastrSpy.success).toHaveBeenCalledWith('Tâche modifiée avec succès');
        expect(component.updateProject.emit).toHaveBeenCalled();
        done();
      });
    });

    it('should handle error when editing task fails', (done) => {
      // Préparer les données
      component.currentEditingTask = mockTask;
      component.showEditForm = true;
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      const error = { error: { message: 'Validation failed' } };
      spyOn(component['http'], 'patch').and.returnValue(throwError(() => error));
      
      // Appeler la méthode à tester
      component.submitEditTask();
      
      // Vérifier les résultats de façon asynchrone
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(toastrSpy.error).toHaveBeenCalledWith('Validation failed');
        done();
      });
    });

    it('should not submit edit task when no task is selected', () => {
      // Préparer les données
      component.currentEditingTask = null;
      
      // Configurer les espions avant d'appeler la méthode testée
      spyOn(console, 'error');
      spyOn(component['http'], 'patch');
      
      // Appeler la méthode à tester
      component.submitEditTask();
      
      // Vérifier les résultats
      expect(console.error).toHaveBeenCalledWith('Aucune tâche sélectionnée');
      expect(component['http'].patch).not.toHaveBeenCalled();
    });
  });
});