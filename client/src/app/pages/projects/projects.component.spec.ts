import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent, Project } from './projects.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let httpClient: HttpClient;

  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'Test Project 1',
      description: 'Description for project 1',
      startDate: '2023-01-01T10:00:00',
      owner: {
        id: 1,
        username: 'owner1',
        email: 'owner1@example.com',
        createdAt: '2023-01-01'
      },
      members: [],
      tasks: [],
      invitations: []
    },
    {
      id: 2,
      name: 'Test Project 2',
      description: 'Description for project 2',
      startDate: '2023-02-01T10:00:00',
      owner: {
        id: 1,
        username: 'owner1',
        email: 'owner1@example.com',
        createdAt: '2023-01-01'
      },
      members: [
        {
          id: 1,
          user: {
            id: 2,
            username: 'member1',
            email: 'member1@example.com',
            createdAt: '2023-01-01'
          },
          role: 'MEMBER'
        }
      ],
      tasks: [],
      invitations: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectsComponent,
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore errors from child components not declared
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load projects on initialization', () => {
      spyOn(component, 'loadProjects').and.returnValue(of([]));
      component.ngOnInit();
      expect(component.loadProjects).toHaveBeenCalled();
    });
  });

  describe('loadProjects', () => {
    it('should load projects successfully', (done) => {
      spyOn(component['http'], 'get').and.returnValue(of(mockProjects));

      component.loadProjects().subscribe(() => {
        expect(component.projects).toEqual(mockProjects);
        expect(component.loading).toBeFalse();
        done();
      });
    });

    it('should handle error when loading projects', (done) => {
      spyOn(httpClient, 'get').and.returnValue(throwError(() => new Error('Network error')));
    
      component.loadProjects().subscribe({
        error: () => {
          expect(component.errorMessage).toBe('Erreur lors du chargement des projets.');
          expect(component.loading).toBeFalse();
          done();
        }
      });
    });
  });

  describe('createProject', () => {
    it('should set showCreateForm to true', () => {
      component.showCreateForm = false;
      component.createProject();
      expect(component.showCreateForm).toBeTrue();
    });
  });

  describe('cancelCreate', () => {
    it('should hide form and reset fields', () => {
      component.showCreateForm = true;
      component.newProject = {
        name: 'Test',
        description: 'Test Desc',
        start_date: '2023-10-10'
      };
      
      component.cancelCreate();
      
      expect(component.showCreateForm).toBeFalse();
      expect(component.newProject).toEqual({
        name: '',
        description: '',
        start_date: ''
      });
    });
  });

  describe('onCreateProject', () => {
    it('should not submit if form is invalid', () => {
      spyOn(component['http'], 'post');
      
      const mockForm: any = {
        valid: false,
        control: {
          markAllAsTouched: jasmine.createSpy('markAllAsTouched')
        }
      };
      
      component.onCreateProject(mockForm);

      expect(component['http'].post).not.toHaveBeenCalled();
      expect(mockForm.control.markAllAsTouched).toHaveBeenCalled();
    });

    it('should create project successfully', (done) => {
      const newProject = {
        name: 'New Project',
        description: 'New Description',
        start_date: '2023-03-01T10:00'
      };
      
      const mockResponse = { id: 3, ...newProject };
      
      spyOn(component['http'], 'post').and.returnValue(of(mockResponse));
      spyOn(component, 'loadProjects').and.returnValue(of([]));
      spyOn(localStorage, 'getItem').and.returnValue('1');
      
      component.newProject = { ...newProject };
      
      const mockForm: any = {
        valid: true,
        control: {
          markAllAsTouched: jasmine.createSpy('markAllAsTouched')
        }
      };
      
      component.onCreateProject(mockForm);
      
      setTimeout(() => {
        expect(component['http'].post).toHaveBeenCalledWith(
          'http://localhost:8080/api/project',
          jasmine.objectContaining({
            name: newProject.name,
            description: newProject.description,
            start_date: '2023-03-01T10:00:00',
            owner_id: 1
          })
        );
      
        expect(component.showCreateForm).toBeFalse();
        expect(component.loadProjects).toHaveBeenCalled();
      
        done();
      });
    });

    it('should handle error when creating project', (done) => {
      const mockError = new Error('Error');

      spyOn(component['http'], 'post').and.returnValue(throwError(() => mockError));
      spyOn(console, 'error');
      spyOn(window, 'alert');
      spyOn(localStorage, 'getItem').and.returnValue('1');

      const mockForm: any = {
        valid: true,
        control: { markAllAsTouched: jasmine.createSpy('markAllAsTouched') }
      };
    
      component.onCreateProject(mockForm);
    
      // attendre que la souscription ait émis l'erreur
      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(window.alert).toHaveBeenCalledWith('Erreur lors de la création du projet');
        done();
      });
    });
  });

  describe('openDrawer', () => {
    it('should set selectedProject and open drawer', () => {
      const project = mockProjects[0];
      
      component.openDrawer(project);
      
      expect(component.selectedProject).toBe(project);
      expect(component.isDrawerOpen).toBeTrue();
    });
  });

  describe('closeDrawer', () => {
    it('should close drawer and reset selectedProject', () => {
      component.isDrawerOpen = true;
      component.selectedProject = mockProjects[0];
      
      component.closeDrawer();
      
      expect(component.isDrawerOpen).toBeFalse();
      expect(component.selectedProject).toBeNull();
    });
  });

  describe('handleProjectUpdated', () => {
    it('should update the selected project with latest data', () => {
      const projectId = 1;
      const updatedProject = { ...mockProjects[0], name: 'Updated Name' };
      
      component.selectedProject = mockProjects[0];
      spyOn(component, 'loadProjects').and.callFake(() => {
        component.projects = [updatedProject, mockProjects[1]];
        return of([]);
      });
      
      component.handleProjectUpdated();
      
      expect(component.selectedProject).toEqual(updatedProject);
    });

    it('should do nothing if no project is selected', () => {
      component.selectedProject = null;
      spyOn(component, 'loadProjects');
      
      component.handleProjectUpdated();
      
      expect(component.loadProjects).not.toHaveBeenCalled();
    });
  });

  describe('onProjectDeleted', () => {
    it('should reload projects and close drawer if deleted project was selected', () => {
      const projectId = 1;
      component.selectedProject = mockProjects[0];
      
      spyOn(component, 'loadProjects').and.returnValue(of([]));
      spyOn(component, 'closeDrawer');
      
      component.onProjectDeleted(projectId);
      
      expect(component.loadProjects).toHaveBeenCalled();
      expect(component.closeDrawer).toHaveBeenCalled();
    });

    it('should only reload projects if deleted project was not selected', () => {
      const projectId = 2;
      component.selectedProject = mockProjects[0]; // id=1
      
      spyOn(component, 'loadProjects').and.returnValue(of([]));
      spyOn(component, 'closeDrawer');
      
      component.onProjectDeleted(projectId);
      
      expect(component.loadProjects).toHaveBeenCalled();
      expect(component.closeDrawer).not.toHaveBeenCalled();
    });
  });

  describe('formatDateForApi', () => {
    it('should format date correctly with seconds', () => {
      const date = '2023-01-01T10:00';
      const result = component['formatDateForApi'](date);
      expect(result).toBe('2023-01-01T10:00:00');
    });

    it('should return empty string for empty input', () => {
      const result = component['formatDateForApi']('');
      expect(result).toBe('');
    });

    it('should not modify date that already has seconds', () => {
      const date = '2023-01-01T10:00:30';
      const result = component['formatDateForApi'](date);
      expect(result).toBe('2023-01-01T10:00:30');
    });
  });

  describe('template interactions', () => {
    it('should display loading indicator when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
        
      const html = fixture.nativeElement.textContent;
        
      expect(html).toContain('Chargement'); // ou "Loading" selon ton template
    });
  });
});