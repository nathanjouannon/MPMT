import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let getItemSpy: jasmine.Spy;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    getItemSpy = spyOn(localStorage, 'getItem');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when token exists', () => {
    getItemSpy.and.returnValue('fake-token');
    
    const result = guard.canActivate();
    
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login and return false when token does not exist', () => {
    getItemSpy.and.returnValue(null);
    
    const result = guard.canActivate();
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
