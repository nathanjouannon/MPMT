import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
    
    // Espionner la méthode post de HttpClient
    httpPostSpy = spyOn(httpClient, 'post').and.callFake(
      (url: string, body: any, options?: any): any => of({
        token: 'fake-token',
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      })
    );
    
    fixture.detectChanges();
  });

  afterEach(() => {
    // Vérifier si tous les spies ont été appelés comme prévu
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

  // it('should send login request and navigate on successful login', fakeAsync(() => {
  //   component.email = 'test@example.com';
  //   component.password = 'password123';
    
  //   // Configuration du spy pour renvoyer une réponse réussie
  //   httpPostSpy.and.returnValue(of({
  //     token: 'fake-token',
  //     id: '1',
  //     username: 'testuser',
  //     email: 'test@example.com'
  //   }));
    
  //   // Appeler login() pour déclencher la requête HTTP
  //   component.login();
  //   tick(); // Faire avancer le temps simulé pour résoudre les observables
    
  //   // Vérifier que HttpClient.post a été appelé avec les bons paramètres
  //   expect(httpPostSpy).toHaveBeenCalledWith(
  //     'http://localhost:8080/api/auth/login',
  //     { email: 'test@example.com', password: 'password123' }
  //   );
    
  //   // Vérifier que les méthodes appropriées ont été appelées
  //   expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-token');
  //   expect(setItemSpy).toHaveBeenCalledWith('current_userID', '1');
  //   expect(setItemSpy).toHaveBeenCalledWith('current_userName', 'testuser');
  //   expect(setItemSpy).toHaveBeenCalledWith('current_userEmail', 'test@example.com');
  //   expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  // }));

  // it('should show error message on login failure', fakeAsync(() => {
  //   component.email = 'test@example.com';
  //   component.password = 'wrongpassword';
    
  //   // Configuration du spy pour simuler une erreur
  //   httpPostSpy.and.returnValue(throwError(() => ({
  //     error: { message: 'Invalid credentials' },
  //     status: 401,
  //     statusText: 'Unauthorized'
  //   })));
    
  //   // Appeler login() pour déclencher la requête
  //   component.login();
  //   tick(); // Faire avancer le temps simulé
    
  //   // Vérifier que HttpClient.post a été appelé avec les bons paramètres
  //   expect(httpPostSpy).toHaveBeenCalledWith(
  //     'http://localhost:8080/api/auth/login',
  //     { email: 'test@example.com', password: 'wrongpassword' }
  //   );
    
  //   fixture.detectChanges();
    
  //   expect(component.error).toBe('Invalid credentials');
  //   const errorElement = fixture.debugElement.query(By.css('.error'));
  //   expect(errorElement).toBeTruthy();
  //   expect(errorElement.nativeElement.textContent).toContain('Invalid credentials');
  // }));

  // it('should use default error message when server error has no message', fakeAsync(() => {
  //   component.email = 'test@example.com';
  //   component.password = 'wrongpassword';
    
  //   // Configuration du spy pour simuler une erreur serveur sans message spécifique
  //   httpPostSpy.and.returnValue(throwError(() => ({
  //     error: {}, // Pas de message dans l'erreur
  //     status: 500,
  //     statusText: 'Server Error'
  //   })));
    
  //   // Appeler login() pour déclencher la requête
  //   component.login();
  //   tick(); // Faire avancer le temps simulé
    
  //   // Vérifier que HttpClient.post a été appelé avec les bons paramètres
  //   expect(httpPostSpy).toHaveBeenCalledWith(
  //     'http://localhost:8080/api/auth/login',
  //     { email: 'test@example.com', password: 'wrongpassword' }
  //   );
    
  //   fixture.detectChanges();
    
  //   // Vérifier que le message d'erreur par défaut est utilisé
  //   expect(component.error).toBe('Email ou mot de passe incorrect');
  // }));
});
