import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDrawerComponent } from './project-drawer.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Project } from '../../pages/projects/projects.component';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectDrawerComponent', () => {
  let component: ProjectDrawerComponent;
  let fixture: ComponentFixture<ProjectDrawerComponent>;
  let httpMock: HttpTestingController;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test description',
    startDate: '2023-01-01T10:00:00',
    owner: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2023-01-01T10:00:00'
    },
    members: [],
    tasks: [],
    invitations: []
  };

  beforeEach(async () => {
    const toastrSpyObj = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    
    await TestBed.configureTestingModule({
      imports: [
        ProjectDrawerComponent,
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDrawerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    
    // Set up the input project
    component.project = mockProject;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when backdrop is clicked', () => {
    const spy = spyOn(component.close, 'emit');
    
    component.onBackdropClick();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should set editMode to true and populate editedProject when editProject is called', () => {
    component.editProject();
    
    expect(component.editMode).toBe(true);
    expect(component.editedProject).toEqual({
      name: mockProject.name,
      description: mockProject.description,
      start_date: mockProject.startDate?.slice(0, 16) || '',
      owner_id: mockProject.owner?.id
    });
  });

  it('should set editMode to false when cancelEdit is called', () => {
    component.editMode = true;
    component.cancelEdit();
    
    expect(component.editMode).toBe(false);
  });

  it('should delete project with confirmation', () => {
    const closeSpy = spyOn(component.close, 'emit');
    const deletedSpy = spyOn(component.projectDeleted, 'emit');
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteProject();
    
    const req = httpMock.expectOne(`http://localhost:8080/api/project/${mockProject.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    
    expect(closeSpy).toHaveBeenCalled();
    expect(deletedSpy).toHaveBeenCalledWith(mockProject.id);
  });

  it('should not delete project without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteProject();
    
    httpMock.expectNone(`http://localhost:8080/api/project/${mockProject.id}`);
  });

  it('should update project when form is valid', () => {
    component.project = mockProject;
    component.editMode = true;
    component.editedProject = {
      name: 'Updated Project',
      description: 'Updated description',
      start_date: '2023-01-02T10:00:00',
      owner_id: 1
    };

    const form = { valid: true, control: { markAllAsTouched: jasmine.createSpy() } } as unknown as NgForm;
    const updatedSpy = spyOn(component.projectUpdated, 'emit');

    component.onUpdateProject(form);

    const req = httpMock.expectOne('http://localhost:8080/api/project');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      project_id: mockProject.id,
      name: 'Updated Project',
      description: 'Updated description',
      start_date: '2023-01-02T10:00:00',
      owner_id: 1
    });

    req.flush({});

    expect(component.editMode).toBe(false);
    expect(updatedSpy).toHaveBeenCalled();
  });

  it('should show alert when update fails', () => {
    component.project = mockProject;
    component.editMode = true;
    component.editedProject = {
      name: 'Updated Project',
      description: 'Updated description',
      start_date: '2023-01-02T10:00:00',
      owner_id: 1
    };

    const form = { valid: true, control: { markAllAsTouched: jasmine.createSpy() } } as unknown as NgForm;
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.onUpdateProject(form);

    const req = httpMock.expectOne('http://localhost:8080/api/project');
    req.error(new ErrorEvent('Network error'));

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la mise à jour du projet');
  });

  it('should mark fields as touched when form is invalid', () => {
    const form = { 
      valid: false, 
      control: { markAllAsTouched: jasmine.createSpy() } 
    } as unknown as NgForm;

    component.onUpdateProject(form);

    expect(form.control.markAllAsTouched).toHaveBeenCalled();
    httpMock.expectNone('http://localhost:8080/api/project');
  });

  it('should show alert on project deletion error', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');
    
    component.deleteProject();
    
    const req = httpMock.expectOne(`http://localhost:8080/api/project/${mockProject.id}`);
    req.error(new ErrorEvent('Network error'));
    
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la suppression du projet');
  });

  it('should not proceed with edit when project is null', () => {
    component.project = null;
    component.editProject();
    expect(component.editMode).toBe(false); // n'a pas changé
  });

  it('should not proceed with delete when project is null', () => {
    component.project = null;
    const confirmSpy = spyOn(window, 'confirm');

    component.deleteProject();

    expect(confirmSpy).not.toHaveBeenCalled();
    httpMock.expectNone(`http://localhost:8080/api/project/${mockProject.id}`);
  });

  it('should emit projectUpdated event when updateProject is called', () => {
    const emitSpy = spyOn(component.projectUpdated, 'emit');
    component.updateProject();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should log message when createTask is called', () => {
    const consoleSpy = spyOn(console, 'log');
    component.createTask();
    expect(consoleSpy).toHaveBeenCalledWith('crée une tache');
  });
});
