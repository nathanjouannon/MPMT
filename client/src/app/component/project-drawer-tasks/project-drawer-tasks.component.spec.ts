import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDrawerTasksComponent } from './project-drawer-tasks.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

describe('ProjectDrawerTasksComponent', () => {
  let component: ProjectDrawerTasksComponent;
  let fixture: ComponentFixture<ProjectDrawerTasksComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

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
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDrawerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
