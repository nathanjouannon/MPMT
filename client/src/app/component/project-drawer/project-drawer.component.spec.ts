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
});
