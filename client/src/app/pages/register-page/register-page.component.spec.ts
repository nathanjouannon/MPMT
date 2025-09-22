import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDrawerTasksComponent } from '../../component/project-drawer-tasks/project-drawer-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';

describe('ProjectDrawerTasksComponent', () => {
  let component: ProjectDrawerTasksComponent;
  let fixture: ComponentFixture<ProjectDrawerTasksComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let httpClient: HttpClient;

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
    httpClient = TestBed.inject(HttpClient);
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('1');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle task form visibility when createTask is called', () => {
    expect(component.showTaskForm).toBeFalse();
    component.createTask();
    expect(component.showTaskForm).toBeTrue();
  });

  it('should hide form and reset when cancelCreateTask is called', () => {
    component.showTaskForm = true;
    component.newTask.title = 'Test Title';
    
    component.cancelCreateTask();
    
    expect(component.showTaskForm).toBeFalse();
    expect(component.newTask.title).toBe('');
  });

  it('should create task successfully', () => {
    component.showTaskForm = true;
    component.newTask = {
      title: 'New Task',
      description: 'New Description',
      dueDate: '2023-01-15',
      endDate: '',
      priority: 'HIGH',
      status: 'TODO'
    };
    
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(of({}));
    const updateProjectSpy = spyOn(component.updateProject, 'emit');
    
    component.submitTask();
    
    expect(httpSpy).toHaveBeenCalledWith('http://localhost:8080/api/task', {
      projectId: 1,
      userRequestingId: 1,
      title: 'New Task',
      description: 'New Description',
      dueDate: '2023-01-15',
      endDate: null,
      priority: 'HIGH',
      status: 'TODO'
    });
    
    expect(updateProjectSpy).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith('Tâche créée avec succès');
    expect(component.showTaskForm).toBeFalse();
  });

  it('should handle error when creating task fails', () => {
    component.showTaskForm = true;
    component.newTask = {
      title: 'New Task',
      description: 'New Description',
      dueDate: '',
      endDate: '',
      priority: 'HIGH',
      status: 'TODO'
    };
    
    const consoleSpy = spyOn(console, 'error');
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(throwError(() => new Error('Error')));
    
    component.submitTask();
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('Erreur lors de la création de la tâche');
  });

  it('should not submit task when project is null', () => {
    component.project = null;
    const consoleSpy = spyOn(console, 'error');
    const httpSpy = spyOn(httpClient, 'post');
    
    component.submitTask();
    
    expect(consoleSpy).toHaveBeenCalledWith('Aucun projet sélectionné');
    expect(httpSpy).not.toHaveBeenCalled();
  });

  it('should return correct CSS class based on task status', () => {
    expect(component.getTaskStatusClass('BACKLOG')).toBe('status-backlog');
    expect(component.getTaskStatusClass('TODO')).toBe('status-todo');
    expect(component.getTaskStatusClass('IN_PROGRESS')).toBe('status-in-progress');
    expect(component.getTaskStatusClass('RETRO')).toBe('status-retro');
    expect(component.getTaskStatusClass('DONE')).toBe('status-done');
    expect(component.getTaskStatusClass('UNKNOWN')).toBe('');
  });

  it('should return correct CSS class based on task priority', () => {
    expect(component.getTaskPriorityClass('VERY_LOW')).toBe('priority-very-low');
    expect(component.getTaskPriorityClass('LOW')).toBe('priority-low');
    expect(component.getTaskPriorityClass('MEDIUM')).toBe('priority-medium');
    expect(component.getTaskPriorityClass('HIGH')).toBe('priority-high');
    expect(component.getTaskPriorityClass('VERY_HIGH')).toBe('priority-very-high');
    expect(component.getTaskPriorityClass('UNKNOWN')).toBe('');
  });

  it('should open task details', () => {
    component.openTaskDetails(mockTask);
    expect(component.selectedTask).toBe(mockTask);
    expect(component.isTaskDrawerOpen).toBeTrue();
  });

  it('should close task drawer', () => {
    component.selectedTask = mockTask;
    component.isTaskDrawerOpen = true;
    
    component.closeTaskDrawer();
    
    expect(component.selectedTask).toBeNull();
    expect(component.isTaskDrawerOpen).toBeFalse();
  });

  it('should emit update when onTaskUpdated is called', () => {
    const updateProjectSpy = spyOn(component.updateProject, 'emit');
    component.onTaskUpdated();
    expect(updateProjectSpy).toHaveBeenCalled();
  });

  it('should open assign form for a task', () => {
    component.openAssignForm(mockTask);
    expect(component.currentAssigningTask).toBe(mockTask);
    expect(component.showAssignForm).toBeTrue();
    expect(component.assignFormData.userEmailToAssign).toBe('');
  });

  it('should cancel task assignment', () => {
    component.currentAssigningTask = mockTask;
    component.showAssignForm = true;
    component.assignFormData.userEmailToAssign = 'test@example.com';
    
    component.cancelAssignTask();
    
    expect(component.currentAssigningTask).toBeNull();
    expect(component.showAssignForm).toBeFalse();
    expect(component.assignFormData.userEmailToAssign).toBe('');
  });

  it('should assign task successfully', () => {
    component.currentAssigningTask = mockTask;
    component.showAssignForm = true;
    component.assignFormData.userEmailToAssign = 'test@example.com';
    
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(of({}));
    const updateProjectSpy = spyOn(component.updateProject, 'emit');
    
    component.submitAssignTask();
    
    expect(httpSpy).toHaveBeenCalledWith('http://localhost:8080/api/task/assign', {
      taskId: 1,
      userRequestingId: 1,
      userEmailToAssign: 'test@example.com'
    });
    
    expect(toastrSpy.success).toHaveBeenCalledWith('Utilisateur assigné avec succès');
    expect(updateProjectSpy).toHaveBeenCalled();
    expect(component.showAssignForm).toBeFalse();
  });

  it('should handle error when assigning task fails', () => {
    component.currentAssigningTask = mockTask;
    component.showAssignForm = true;
    component.assignFormData.userEmailToAssign = 'test@example.com';
    
    const consoleSpy = spyOn(console, 'error');
    const error = { error: { message: 'User not found' } };
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(throwError(() => error));
    
    component.submitAssignTask();
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('User not found');
  });

  it('should handle error without message when assigning task fails', () => {
    component.currentAssigningTask = mockTask;
    component.showAssignForm = true;
    component.assignFormData.userEmailToAssign = 'test@example.com';
    
    const error = { status: 500 };
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(throwError(() => error));
    
    component.submitAssignTask();
    
    expect(toastrSpy.error).toHaveBeenCalledWith('Erreur lors de l\'assignation de la tâche');
  });

  it('should not submit assign task when no task is selected', () => {
    component.currentAssigningTask = null;
    const consoleSpy = spyOn(console, 'error');
    const httpSpy = spyOn(httpClient, 'post');
    
    component.submitAssignTask();
    
    expect(consoleSpy).toHaveBeenCalledWith('Aucune tâche sélectionnée');
    expect(httpSpy).not.toHaveBeenCalled();
  });

  it('should not submit assign task when no email is provided', () => {
    component.currentAssigningTask = mockTask;
    component.assignFormData.userEmailToAssign = '';
    
    const alertSpy = spyOn(window, 'alert');
    const httpSpy = spyOn(httpClient, 'post');
    
    component.submitAssignTask();
    
    expect(alertSpy).toHaveBeenCalledWith('Veuillez entrer un email');
    expect(httpSpy).not.toHaveBeenCalled();
  });

  it('should open edit form for a task', () => {
    component.openEditForm(mockTask);
    
    expect(component.currentEditingTask).toBe(mockTask);
    expect(component.showEditForm).toBeTrue();
    expect(component.editTaskForm.title).toBe('Test Task');
    expect(component.editTaskForm.description).toBe('Test Description');
  });

  it('should cancel task editing', () => {
    component.currentEditingTask = mockTask;
    component.showEditForm = true;
    
    component.cancelEditTask();
    
    expect(component.currentEditingTask).toBeNull();
    expect(component.showEditForm).toBeFalse();
  });

  it('should edit task successfully', () => {
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
    
    const httpSpy = spyOn(httpClient, 'patch').and.returnValue(of({}));
    const updateProjectSpy = spyOn(component.updateProject, 'emit');
    
    component.submitEditTask();
    
    expect(httpSpy).toHaveBeenCalledWith('http://localhost:8080/api/task/1', {
      title: 'Updated Task',
      description: 'Updated Description',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: '2023-01-15',
      userRequestingId: 1
    });
    
    expect(toastrSpy.success).toHaveBeenCalledWith('Tâche modifiée avec succès');
    expect(updateProjectSpy).toHaveBeenCalled();
  });

  it('should handle error when editing task fails', () => {
    component.currentEditingTask = mockTask;
    component.showEditForm = true;
    
    const consoleSpy = spyOn(console, 'error');
    const error = { error: { message: 'Validation failed' } };
    const httpSpy = spyOn(httpClient, 'patch').and.returnValue(throwError(() => error));
    
    component.submitEditTask();
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('Validation failed');
  });

  it('should not submit edit task when no task is selected', () => {
    component.currentEditingTask = null;
    const consoleSpy = spyOn(console, 'error');
    const httpSpy = spyOn(httpClient, 'patch');
    
    component.submitEditTask();
    
    expect(consoleSpy).toHaveBeenCalledWith('Aucune tâche sélectionnée');
    expect(httpSpy).not.toHaveBeenCalled();
  });
});