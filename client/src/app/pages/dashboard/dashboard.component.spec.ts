import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let removeItemSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    removeItemSpy = spyOn(localStorage, 'removeItem');
    navigateSpy = spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard/projects on init', () => {
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['dashboard/projects']);
  });

  it('should remove token and navigate to login on logout', () => {
    component.logout();
    
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
