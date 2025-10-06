import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    localStorageSpy = jasmine.createSpyObj('Storage', ['setItem']);
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy
    });

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
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('should call API with email and password and navigate to dashboard on success', () => {
      // Préparer les données de test
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        token: 'fake-jwt-token',
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      // Configurer les espions avant d'appeler la méthode testée
      spyOn(component['http'], 'post').and.returnValue(of(mockResponse));
      spyOn(router, 'navigate');

      // Définir les valeurs dans le composant
      component.email = mockCredentials.email;
      component.password = mockCredentials.password;

      // Appeler la méthode à tester
      component.login();

      // Vérifier que la requête HTTP a été appelée avec les bonnes données
      expect(component['http'].post).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/login',
        mockCredentials
      );

      // Vérifier que les données ont été stockées dans localStorage
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('token', mockResponse.token);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('current_userID', mockResponse.id);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('current_userName', mockResponse.username);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('current_userEmail', mockResponse.email);

      // Vérifier que la navigation a été effectuée
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should set error message when API returns an error with message', () => {
      // Préparer la réponse d'erreur
      const errorResponse = {
        error: {
          message: 'Identifiants invalides'
        }
      };

      // Configurer l'espion pour simuler une erreur
      spyOn(component['http'], 'post').and.returnValue(throwError(() => errorResponse));

      // Appeler la méthode à tester
      component.login();

      // Vérifier que le message d'erreur est défini
      expect(component.error).toBe('Identifiants invalides');

      // Vérifier que le message d'erreur apparaît dans le DOM
      fixture.detectChanges(); // Mettre à jour le DOM après la modification
      const errorElement = fixture.debugElement.query(By.css('.error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain('Identifiants invalides');
    });

    it('should set default error message when API returns an error without message', () => {
      // Préparer la réponse d'erreur sans message spécifique
      const errorResponse = {
        error: {}
      };

      // Configurer l'espion pour simuler une erreur
      spyOn(component['http'], 'post').and.returnValue(throwError(() => errorResponse));

      // Appeler la méthode à tester
      component.login();

      // Vérifier que le message d'erreur par défaut est défini
      expect(component.error).toBe('Email ou mot de passe incorrect');
    });
  });

  describe('form submission', () => {
    it('should call login method when form is submitted', () => {
      // Configurer l'espion sur la méthode login
      spyOn(component, 'login');

      // Simuler la soumission du formulaire
      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);

      // Vérifier que la méthode login a été appelée
      expect(component.login).toHaveBeenCalled();
    });
  });

  describe('template interactions', () => {
    it('should update component properties when form inputs change', () => {
      // Obtenir les éléments d'entrée du formulaire
      const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
      const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;

      // Simuler les changements d'entrée
      emailInput.value = 'new@example.com';
      emailInput.dispatchEvent(new Event('input'));
      
      passwordInput.value = 'newpassword';
      passwordInput.dispatchEvent(new Event('input'));

      // Vérifier que les propriétés du composant sont mises à jour
      expect(component.email).toBe('new@example.com');
      expect(component.password).toBe('newpassword');
    });

    it('should display back link to homepage', () => {
      const backLink = fixture.debugElement.query(By.css('.back-link'));
      expect(backLink).toBeTruthy();
      expect(backLink.attributes['routerLink']).toBe('/');
    });

    it('should display register link', () => {
      const registerLink = fixture.debugElement.query(By.css('.btn-outline'));
      expect(registerLink).toBeTruthy();
      expect(registerLink.attributes['routerLink']).toBe('/register');
    });
  });
});