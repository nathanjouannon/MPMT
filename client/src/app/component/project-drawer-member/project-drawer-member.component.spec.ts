import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDrawerMemberComponent } from './project-drawer-member.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

describe('ProjectDrawerMemberComponent', () => {
  let component: ProjectDrawerMemberComponent;
  let fixture: ComponentFixture<ProjectDrawerMemberComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    // Créer un spy pour ToastrService
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
