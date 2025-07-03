import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  role?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  // La API devuelve el token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://api.escuelajs.co/api/v1';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);
  private tokenExpirationTimer: any = null;

  // Exponer señales de solo lectura
  user = this.currentUser.asReadonly();
  loggedIn = computed(() => this.isAuthenticated());

  private message = inject(NzMessageService);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.autoLogin();
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { 
      email, 
      password 
    }).pipe(
      switchMap(({ access_token }) => {
        // Guardamos el token
        localStorage.setItem(this.TOKEN_KEY, access_token);
        
        // Obtenemos el perfil del usuario
        return this.getUserProfile().pipe(
          tap(user => {
            this.handleAuthentication(user, access_token, 3600);
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        let errorMessage = 'Error en el inicio de sesión';
        
        if (error.status === 401) {
          errorMessage = 'Credenciales inválidas';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`).pipe(
      catchError(error => {
        console.error('Error al obtener perfil:', error);
        return throwError(() => new Error('No se pudo cargar el perfil del usuario'));
      })
    );
  }

  private handleAuthentication(user: User, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    
    // Guardar token y datos del usuario
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem('token_expiration', expirationDate.toISOString());
    
    // Actualizar el estado
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    
    // Configurar temporizador de expiración
    this.setAutoLogout(expiresIn * 1000);
    
    // Redirigir después de login exitoso
    this.router.navigate(['/']);
  }

  autoLogin() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    const expirationDate = localStorage.getItem('token_expiration');
    
    if (!token || !userData || !expirationDate) {
      return;
    }
    
    const expirationTime = new Date(expirationDate).getTime() - new Date().getTime();
    
    if (expirationTime <= 0) {
      this.logout();
      return;
    }
    
    this.currentUser.set(JSON.parse(userData));
    this.isAuthenticated.set(true);
    this.setAutoLogout(expirationTime);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token_expiration');
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private setAutoLogout(expirationDuration: number) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  // Método para registrar un nuevo usuario
  register(userData: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/`, {
      ...userData,
      role: 'customer', // Rol por defecto
      avatar: userData.avatar || 'https://api.lorem.space/image/face?w=150&h=150'
    }).pipe(
      tap(newUser => {
        // Después de registrar, hacemos login automático
        this.login(userData.email, userData.password).subscribe({
          next: () => {
            this.message.success('¡Registro exitoso!');
          },
          error: (error) => {
            console.error('Error en auto-login después de registro:', error);
            this.message.warning('Cuenta creada, por favor inicia sesión');
          }
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Register error:', error);
        let errorMessage = 'Error en el registro';
        
        if (error.status === 400) {
          errorMessage = 'El correo ya está en uso';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Método para actualizar el perfil del usuario
  updateProfile(updates: Partial<User>): Observable<User> {
    const userId = this.currentUser()?.id;
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.put<User>(`${this.API_URL}/users/${userId}`, updates).pipe(
      tap(updatedUser => {
        this.currentUser.set(updatedUser);
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar perfil:', error);
        let errorMessage = 'Error al actualizar el perfil';
        
        if (error.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente';
          this.logout();
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
