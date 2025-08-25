import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDrawerTasksComponent } from './project-drawer-tasks.component';

describe('ProjectDrawerTasksComponent', () => {
  let component: ProjectDrawerTasksComponent;
  let fixture: ComponentFixture<ProjectDrawerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDrawerTasksComponent]
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
