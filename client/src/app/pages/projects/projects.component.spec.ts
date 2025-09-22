import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProjectsComponent, Project, Owner } from './projects.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockOwner: Owner = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2023-01-01'
  };

  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'Projet Test 1',
      description: 'Description du projet test 1',
      startDate: '2023-01-01T10:00:00',
      owner: mockOwner,
      members: [],
      tasks: [],
      invitations: []
    },
    {
      id: 2,
      name: 'Projet Test 2',
      description: 'Description du projet test 2',
      startDate: '2023-01-02T10:00:00',
      owner: mockOwner,
      members: [],
      tasks: [],
      invitations: []
    }
  ];

  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    
    await TestBed.configureTestingModule({
      imports: [
        ProjectsComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: HttpClient, useValue: httpSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Pour ignorer les erreurs de composants enfants non déclarés
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    
    // Configuration par défaut du spy
    httpClientSpy.get.and.returnValue(of(mockProjects));

    // Spy sur localStorage
    spyOn(localStorage, 'getItem').and.returnValue('1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    component.ngOnInit();
    
    expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:8080/api/project');
    expect(component.projects).toEqual(mockProjects);
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should handle error when loading projects fails', () => {
    httpClientSpy.get.and.returnValue(throwError(() => new Error('Test error')));
    
    component.ngOnInit();
    
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Erreur lors du chargement des projets.');
  });

  it('should show create project form when createProject is called', () => {
    component.createProject();
    
    expect(component.showCreateForm).toBeTrue();
  });

  it('should hide form and reset model when cancelCreate is called', () => {
    component.newProject = {
      name: 'Test Project',
      description: 'Test Description',
      start_date: '2023-05-10T10:00:00'
    };
    component.showCreateForm = true;
    
    component.cancelCreate();
    
    expect(component.showCreateForm).toBeFalse();
    expect(component.newProject).toEqual({
      name: '',
      description: '',
      start_date: ''
    });
  });

  it('should not submit form when it is invalid', () => {
    const mockForm = {
      valid: false,
      control: {
        markAllAsTouched: jasmine.createSpy('markAllAsTouched')
      }
    } as unknown as NgForm;
    
    component.onCreateProject(mockForm);
    
    expect(mockForm.control.markAllAsTouched).toHaveBeenCalled();
    expect(httpClientSpy.post).not.toHaveBeenCalled();
  });

  it('should submit form when it is valid and create project', () => {
    const mockForm = {
      valid: true,
      control: {
        markAllAsTouched: jasmine.createSpy('markAllAsTouched')
      }
    } as unknown as NgForm;
    
    component.newProject = {
      name: 'Test Project',
      description: 'Test Description',
      start_date: '2023-05-10T10:00'
    };
    
    httpClientSpy.post.and.returnValue(of({}));
    
    component.onCreateProject(mockForm);
    
    expect(httpClientSpy.post).toHaveBeenCalledWith('http://localhost:8080/api/project', {
      name: 'Test Project',
      description: 'Test Description',
      start_date: '2023-05-10T10:00:00',
      owner_id: 1
    });
    expect(component.showCreateForm).toBeFalse();
    expect(httpClientSpy.get).toHaveBeenCalled(); // loadProjects est appelé après la création
  });

  it('should handle error during project creation', () => {
    const mockForm = {
      valid: true,
      control: {
        markAllAsTouched: jasmine.createSpy('markAllAsTouched')
      }
    } as unknown as NgForm;
    
    component.newProject = {
      name: 'Test Project',
      description: 'Test Description',
      start_date: '2023-05-10T10:00'
    };
    
    httpClientSpy.post.and.returnValue(throwError(() => new Error('Test error')));
    const consoleErrorSpy = spyOn(console, 'error');
    const alertSpy = spyOn(window, 'alert');
    
    component.onCreateProject(mockForm);
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Erreur lors de la création du projet');
  });

  it('should correctly format date for API', () => {
    // Test avec une date sans secondes
    const dateWithoutSeconds = '2023-05-10T10:00';
    const formattedDate = component['formatDateForApi'](dateWithoutSeconds);
    expect(formattedDate).toBe('2023-05-10T10:00:00');
    
    // Test avec une date complète
    const fullDate = '2023-05-10T10:00:00';
    const formattedFullDate = component['formatDateForApi'](fullDate);
    expect(formattedFullDate).toBe(fullDate);
    
    // Test avec une valeur vide
    expect(component['formatDateForApi']('')).toBe('');
  });

  it('should reset form model correctly', () => {
    component.newProject = {
      name: 'Test',
      description: 'Test Description',
      start_date: '2023-01-01'
    };
    
    component['resetFormModel']();
    
    expect(component.newProject).toEqual({
      name: '',
      description: '',
      start_date: ''
    });
  });

  it('should open drawer with selected project', () => {
    const project = mockProjects[0];
    
    component.openDrawer(project);
    
    expect(component.selectedProject).toBe(project);
    expect(component.isDrawerOpen).toBeTrue();
  });

  it('should close drawer and reset selectedProject', () => {
    component.selectedProject = mockProjects[0];
    component.isDrawerOpen = true;
    
    component.closeDrawer();
    
    expect(component.isDrawerOpen).toBeFalse();
    expect(component.selectedProject).toBeNull();
  });

  it('should handle project update and reload projects', () => {
    component.selectedProject = mockProjects[0];
    const loadProjectsSpy = spyOn(component, 'loadProjects').and.returnValue(of([]));
    
    component.handleProjectUpdated();
    
    expect(loadProjectsSpy).toHaveBeenCalled();
  });

  it('should do nothing in handleProjectUpdated if no project is selected', () => {
    component.selectedProject = null;
    const loadProjectsSpy = spyOn(component, 'loadProjects').and.returnValue(of([]));
    
    component.handleProjectUpdated();
    
    expect(loadProjectsSpy).not.toHaveBeenCalled();
  });

  it('should handle project deletion and reload projects', () => {
    const loadProjectsSpy = spyOn(component, 'loadProjects').and.returnValue(of([]));
    
    component.onProjectDeleted(1);
    
    expect(loadProjectsSpy).toHaveBeenCalled();
  });

  it('should close drawer if deleted project is the selected one', () => {
    component.selectedProject = mockProjects[0];
    component.isDrawerOpen = true;
    spyOn(component, 'loadProjects').and.returnValue(of([]));
    
    component.onProjectDeleted(1);
    
    expect(component.isDrawerOpen).toBeFalse();
    expect(component.selectedProject).toBeNull();
  });

  it('should display projects in the UI', () => {
    component.projects = mockProjects;
    fixture.detectChanges();
    
    const projectCards = fixture.debugElement.queryAll(By.css('.project-card'));
    expect(projectCards.length).toBe(2); // Le formulaire de création est aussi une .project-card
    
    // Vérifier le contenu de la première carte
    const firstCardTitle = projectCards[0].query(By.css('h2'));
    expect(firstCardTitle.nativeElement.textContent).toContain('Projet Test 1');
  });

  it('should display loading message when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingElement = fixture.debugElement.query(By.css('div'));
    expect(loadingElement.nativeElement.textContent).toContain('Chargement des projets...');
  });

  it('should display error message when there is an error', () => {
    component.errorMessage = 'Test error message';
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement.nativeElement.textContent).toContain('Test error message');
  });

  it('should call openDrawer when project card is clicked', () => {
    component.projects = mockProjects;
    fixture.detectChanges();
    
    const openDrawerSpy = spyOn(component, 'openDrawer');
    const projectCards = fixture.debugElement.queryAll(By.css('.project-card'));
    
    // Cliquer sur la première carte (index 0 est le formulaire si visible)
    projectCards[0].triggerEventHandler('click', null);
    
    expect(openDrawerSpy).toHaveBeenCalledWith(mockProjects[0]);
  });
});