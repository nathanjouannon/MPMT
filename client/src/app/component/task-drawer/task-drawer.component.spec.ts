import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDrawerComponent } from './task-drawer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

describe('TaskDrawerComponent', () => {
  let component: TaskDrawerComponent;
  let fixture: ComponentFixture<TaskDrawerComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
