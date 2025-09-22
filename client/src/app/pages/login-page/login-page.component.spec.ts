import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let httpClient: HttpClient;
  let router: Router;
  let setItemSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;
  let httpPostSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginPageComponent,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    setItemSpy = spyOn(localStorage, 'setItem');
    navigateSpy = spyOn(router, 'navigate');
    
    httpPostSpy = spyOn(httpClient, 'post');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form fields', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe('');
  });

  it('should have required form elements', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    const registerLink = fixture.debugElement.query(By.css('a[routerLink="/register"]'));
    
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(registerLink).toBeTruthy();
    expect(submitButton.nativeElement.textContent).toContain('Se connecter');
    expect(registerLink.nativeElement.textContent).toContain('Pas encore de compte ?');
  });

  it('should update form values on input change', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]')).nativeElement;
    
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    
    expect(component.email).toBe('test@example.com');
    expect(component.password).toBe('password123');
  });

  it('should submit the form when login button is clicked', () => {
    const loginSpy = spyOn(component, 'login');
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    
    submitButton.nativeElement.click();
    
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should display error message when it exists', () => {
    component.error = 'Test error message';
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toBe('Test error message');
  });

  it('should not display error message when error is empty', () => {
    component.error = '';
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeNull();
  });

  it('should have a back button linking to home page', () => {
    const backLink = fixture.debugElement.query(By.css('.back-link'));
    expect(backLink).toBeTruthy();
    expect(backLink.attributes['routerLink']).toBe('/');
  });
});