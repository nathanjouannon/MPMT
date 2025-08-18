import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDrawerMemberComponent } from './project-drawer-member.component';

describe('ProjectDrawerMemberComponent', () => {
  let component: ProjectDrawerMemberComponent;
  let fixture: ComponentFixture<ProjectDrawerMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDrawerMemberComponent]
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
