import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  role?: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
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
  private readonly AUTH_URL = 'https://api.escuelajs.co/api/v1/auth';
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);
  private tokenExpirationTimer: any = null;
  private isLoading = signal<boolean>(false);

  // Exponer señales de solo lectura
  user = this.currentUser.asReadonly();
  loggedIn = computed(() => this.isAuthenticated());

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  private message = inject(NzMessageService);
  private http = inject(HttpClient);
  private router = inject(Router);

  private isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

  constructor() {
    // Verificar la sesión al iniciar
    if (this.isBrowser) {
      this.checkAuthStatus();
    }
  }

  login(email: string, password: string): Observable<User> {
    this.isLoading.set(true);
    
    // Configurar los headers para la petición
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
<<<<<<< HEAD
    // Datos para el login segúnla API
=======
    // Datos para el login según la documentación de la API
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
    const loginData = {
      email: email,
      password: password
    };
    
    return this.http.post<AuthResponse>(
      `${this.AUTH_URL}/login`, 
      loginData,
      { headers }
    ).pipe(
      switchMap((response) => {
        if (!response || !response.access_token) {
          throw new Error('No se recibió un token de acceso válido');
        }
        
        // Guardar el token en el almacenamiento local
        if (this.isBrowser) {
          localStorage.setItem('auth_token', response.access_token);
        }
        
        // Configurar los headers para las siguientes peticiones
        const authHeaders = {
          'Authorization': `Bearer ${response.access_token}`,
          'Content-Type': 'application/json'
        };
        
        // Obtener el perfil del usuario
        return this.http.get<User>(`${this.API_URL}/auth/profile`, { 
          headers: authHeaders 
        }).pipe(
          tap(user => {
            // Combinar la información del perfil con el token
            const authenticatedUser = {
              ...user,
              accessToken: response.access_token
            };
            
            // Guardar el usuario autenticado
            this.handleAuthentication(authenticatedUser);
            
<<<<<<< HEAD
            
=======
            // Redirigir al dashboard después de un inicio de sesión exitoso
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
            this.router.navigate(['/welcome']);
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        let errorMessage = 'Error en el inicio de sesión';
        
        if (error.status === 401) {
          errorMessage = 'Credenciales inválidas';
        } else if (error.status === 400) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.message.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  private getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener perfil:', error);
        return throwError(() => new Error('No se pudo cargar el perfil del usuario'));
      })
    );
  }

  private handleAuthentication(user: User) {
    if (!this.isBrowser) return;
    
    // Guardar el usuario en el estado
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    
    // Guardar en localStorage
    if (this.isBrowser) {
      // Guardar el usuario sin el token en el localStorage
      const { accessToken, refreshToken, ...userWithoutTokens } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutTokens));
      
      // Guardar el token de acceso por separado
      if (accessToken) {
        localStorage.setItem('auth_token', accessToken);
      }
    }
    
    // Configurar tiempo de expiración del token (asumiendo 24 horas)
    const expiresIn = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    this.setLogoutTimer(expiresIn);
    
    // Notificar a otros componentes que la autenticación ha cambiado
    if (this.isBrowser) {
      window.dispatchEvent(new Event('storage'));
    }
  }

  private checkAuthStatus() {
    if (!this.isBrowser) return;
    
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.logout();
      return;
    }
    
    this.isLoading.set(true);
    
    // Configurar los headers para la petición
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Intentar obtener el perfil del usuario
    this.http.get<User>(`${this.API_URL}/auth/profile`, { headers }).subscribe({
      next: (user) => {
        // Si obtenemos el perfil exitosamente, el token es válido
        const authenticatedUser = {
          ...user,
          accessToken: token
        };
        
        this.currentUser.set(authenticatedUser);
        this.isAuthenticated.set(true);
        
        // Guardar el usuario en localStorage sin el token
        const { accessToken, refreshToken, ...userWithoutTokens } = authenticatedUser;
        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(userWithoutTokens));
        }
        
        // Configurar el temporizador de expiración
        const expiresIn = 24 * 60 * 60 * 1000; // 24 horas
        this.setLogoutTimer(expiresIn);
      },
      error: (error) => {
        console.error('Error al verificar autenticación:', error);
        // Si hay un error al obtener el perfil, forzar logout
        this.logout();
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  logout() {
    // Limpiar el estado local
    this.clearLogoutTimer();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    
    // Limpiar el almacenamiento local
    if (this.isBrowser) {
      localStorage.removeItem('user');
      // Limpiar cualquier otro dato de sesión que pueda existir
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('auth_') || key.includes('token') || key.includes('user')) {
          localStorage.removeItem(key);
        }
      });
      
      // Limpiar también sessionStorage por si acaso
      sessionStorage.clear();
    }
    
    // Redirigir al login
    this.router.navigate(['/auth/login']);
    
    // Opcional: Emitir un evento de cierre de sesión
    if (this.isBrowser && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }

  private clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private setLogoutTimer(expiresIn: number) {
    if (!this.isBrowser) return;
    
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user?.accessToken || null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  // Método para registrar un nuevo usuario
<<<<<<< HEAD
  register(userData: any): Observable<User> {
=======
  register(userData: RegisterData): Observable<User> {
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
    this.isLoading.set(true);
    
    // Ajustar los datos según lo que espera la API
    const registerData = {
<<<<<<< HEAD
      name: userData.name, 
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || 'https://api.lorem.space/image/face?w=150&h=150'
    };

    // crear el usuario
    return this.http.post<User>(`${this.API_URL}/users/`, registerData).pipe(
      tap(user => {
        this.message.success('¡Registro exitoso!');
        // No iniciamos sesión automáticamente, el usuario debe iniciar sesión manualmente
=======
      name: userData.name,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || 'https://picsum.photos/800' // Usando el avatar por defecto de la documentación
    };

    // Primero creamos el usuario
    return this.http.post<User>(`${this.API_URL}/users/`, registerData).pipe(
      switchMap((newUser) => {
        this.message.success('¡Registro exitoso! Iniciando sesión...');
        // Iniciamos sesión automáticamente después del registro
        return this.login(userData.email, userData.password).pipe(
          catchError(error => {
            // Si hay un error en el login después del registro, redirigir al login
            this.message.warning('Registro exitoso, pero no se pudo iniciar sesión automáticamente');
            this.router.navigate(['/auth/login']);
            return throwError(() => new Error('Error al iniciar sesión después del registro'));
          })
        );
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Register error:', error);
        let errorMessage = 'Error en el registro';
        
        if (error.status === 400) {
<<<<<<< HEAD
          errorMessage = 'Datos de registro inválidos';
        } else if (error.status === 409) {
          errorMessage = 'El correo electrónico ya está registrado';
=======
          errorMessage = 'El correo ya está en uso';
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.message.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  // Método para actualizar el perfil del usuario
  updateProfile(updates: Partial<User>): Observable<User> {
    this.isLoading.set(true);
    
    const userId = this.currentUser()?.id;
    if (!userId) {
      this.isLoading.set(false);
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Crear un objeto con solo los campos que se van a actualizar
    const updateData: any = {};
    
    // Solo incluir los campos que tienen valor
    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.avatar) updateData.avatar = updates.avatar;
    if (updates.password) updateData.password = updates.password;

    return this.http.put<User>(`${this.API_URL}/users/${userId}`, updateData).pipe(
      tap(updatedUser => {
        // Actualizar el usuario actual con los nuevos datos
        const currentUser = this.currentUser();
        if (currentUser) {
          this.currentUser.set({ ...currentUser, ...updatedUser });
        }
        this.message.success('Perfil actualizado correctamente');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar perfil:', error);
        let errorMessage = 'Error al actualizar el perfil';
        
        if (error.status === 400) {
          errorMessage = 'Datos inválidos';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado';
          this.logout(); // Cerrar sesión si el token es inválido
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar al servidor';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.message.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
      finalize(() => this.isLoading.set(false))
    );
  }
}
