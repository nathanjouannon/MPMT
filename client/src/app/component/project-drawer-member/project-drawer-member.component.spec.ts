import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDrawerMemberComponent } from './project-drawer-member.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('ProjectDrawerMemberComponent', () => {
  let component: ProjectDrawerMemberComponent;
  let fixture: ComponentFixture<ProjectDrawerMemberComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const mockProject = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    startDate: '2023-01-01',
    owner: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
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
        role: 'ADMIN'
      }
    ],
    tasks: [],
    invitations: []
  };

  beforeEach(async () => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);
    
    await TestBed.configureTestingModule({
      imports: [
        ProjectDrawerMemberComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDrawerMemberComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    component.project = mockProject;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle form visibility when toggleForm is called', () => {
    expect(component.showForm).toBeFalse();
    component.toggleForm();
    expect(component.showForm).toBeTrue();
    component.toggleForm();
    expect(component.showForm).toBeFalse();
  });

  it('should not submit form when form is invalid', () => {
    const httpSpy = spyOn(httpClient, 'post');
    const form = { valid: false, control: { markAllAsTouched: jasmine.createSpy() } } as unknown as NgForm;
    
    component.onAddMember(form);
    
    expect(form.control.markAllAsTouched).toHaveBeenCalled();
    expect(httpSpy).not.toHaveBeenCalled();
  });

  it('should add member successfully', () => {
    component.showForm = true;
    component.addMemberForm = {
      userEmail: 'newmember@example.com',
      role: 'MEMBER'
    };
    
    const form = { valid: true } as NgForm;
    const updateProjectSpy = spyOn(component.updateProject, 'emit');
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(of({}));
    
    component.onAddMember(form);
    
    expect(httpSpy).toHaveBeenCalledWith('http://localhost:8080/api/project/addMember', {
      userRequestingID: mockProject.owner.id,
      userEmail: 'newmember@example.com',
      projectId: mockProject.id,
      role: 'MEMBER'
    });
    expect(toastrSpy.success).toHaveBeenCalledWith('Utilisateur ajouté avec succès');
    expect(component.showForm).toBeFalse();
    expect(component.addMemberForm).toEqual({ userEmail: '', role: '' });
    expect(updateProjectSpy).toHaveBeenCalled();
  });

  it('should handle error with message when adding member fails', () => {
    component.showForm = true;
    component.addMemberForm = {
      userEmail: 'invalid@example.com',
      role: 'MEMBER'
    };
    
    const form = { valid: true } as NgForm;
    const error = { error: { message: 'User already member' } };
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(throwError(() => error));
    const consoleSpy = spyOn(console, 'log');
    
    component.onAddMember(form);
    
    expect(httpSpy).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('User already member', 'Erreur');
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it('should handle error without message when adding member fails', () => {
    component.showForm = true;
    component.addMemberForm = {
      userEmail: 'invalid@example.com',
      role: 'MEMBER'
    };
    
    const form = { valid: true } as NgForm;
    const error = { status: 500 };
    const httpSpy = spyOn(httpClient, 'post').and.returnValue(throwError(() => error));
    
    component.onAddMember(form);
    
    expect(httpSpy).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('Une erreur est survenue', 'Erreur');
  });

  it('should render member list correctly', () => {
    fixture.detectChanges();
    const memberElements = fixture.nativeElement.querySelectorAll('.member-item');
    expect(memberElements.length).toBe(1);
    expect(memberElements[0].querySelector('.member-name').textContent).toContain('member1');
    expect(memberElements[0].querySelector('.member-role').textContent.trim()).toBe('ADMIN');
  });

  it('should have correct form fields when form is visible', () => {
    component.showForm = true;
    fixture.detectChanges();
    
    const emailInput = fixture.nativeElement.querySelector('input[name="userEmail"]');
    const roleSelect = fixture.nativeElement.querySelector('select[name="role"]');
    const options = roleSelect.querySelectorAll('option');
    
    expect(emailInput).toBeTruthy();
    expect(roleSelect).toBeTruthy();
    expect(options.length).toBe(3);
    expect(options[0].value).toBe('ADMIN');
    expect(options[1].value).toBe('MEMBER');
    expect(options[2].value).toBe('OBSERVER');
  });
});