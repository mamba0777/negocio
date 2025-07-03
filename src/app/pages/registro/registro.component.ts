import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    NzFormModule, 
    NzInputModule, 
    NzButtonModule, 
    NzCardModule,
    NzIconModule,
    RouterModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // Estado del componente
  modo = signal<'registro' | 'perfil'>('registro');
  cargando = signal(false);
  usuarioActual = signal<User | null>(null);
  passwordVisible = false;
  confirmarPasswordVisible = false;

  // Formulario reactivo
  form!: FormGroup;

  // Computed properties
  esRegistro = computed(() => this.modo() === 'registro');
  titulo = computed(() => this.esRegistro() ? 'Crear Cuenta' : 'Mi Perfil');
  textoBoton = computed(() => this.esRegistro() ? 'Registrarse' : 'Guardar Cambios');

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (this.authService.loggedIn()) {
      this.modo.set('perfil');
      this.usuarioActual.set(this.authService.user());
      this.inicializarFormularioPerfil();
    } else {
      this.inicializarFormularioRegistro();
    }
  }

  private inicializarFormularioRegistro(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    }, { validators: this.validarCoincidenciaContrasenas.bind(this) });
  }

  private inicializarFormularioPerfil(): void {
    const usuario = this.usuarioActual();
    this.form = this.fb.group({
      nombre: [usuario?.name || '', [Validators.required]],
      email: [
        { value: usuario?.email || '', disabled: true }, 
        [Validators.required, Validators.email]
      ],
      password: ['', [Validators.minLength(6)]],
      confirmarPassword: [''],
    }, { validators: this.validarCoincidenciaContrasenas.bind(this) });
  }

  private validarCoincidenciaContrasenas(control: AbstractControl): ValidationErrors | null {
    // Verificar si el control es un FormGroup
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const password = control.get('password');
    const confirmarPassword = control.get('confirmarPassword');

    // Si alguno de los controles no existe, no hay nada que validar
    if (!password || !confirmarPassword) {
      return null;
    }

    const passwordValue = password.value;
    const confirmarPasswordValue = confirmarPassword.value;

    // Si ambos campos están vacíos, no mostrar error
    if (!passwordValue && !confirmarPasswordValue) {
      return null;
    }

    // Si las contraseñas no coinciden, retornar error
    if (passwordValue !== confirmarPasswordValue) {
      return { mismatch: true };
    }

    // Si llega aquí, las contraseñas coinciden
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.cargando.set(true);
    const { nombre, email, password } = this.form.value;

    if (this.esRegistro()) {
      this.registrarUsuario({ nombre, email, password });
    } else {
      this.actualizarPerfil({ nombre, password });
    }
  }

  private registrarUsuario(datos: { nombre: string; email: string; password: string }): void {
    this.authService.register({
      name: datos.nombre,
      email: datos.email,
      password: datos.password
    }).subscribe({
      next: (usuario) => {
        this.message.success('¡Registro exitoso! Redirigiendo...');
        // Auto-login después del registro
        this.authService.login(datos.email, datos.password).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error en auto-login:', error);
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.message.error('Error al registrar el usuario. Intente nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  private actualizarPerfil(datos: { nombre: string; password?: string }): void {
    // Crear un objeto con las actualizaciones
    const actualizaciones: { name: string; password?: string } = { 
      name: datos.nombre 
    };
    
    // Solo actualizar la contraseña si se proporcionó una nueva
    if (datos.password) {
      actualizaciones.password = datos.password;
    }

    // Usar 'as User' para asegurar la compatibilidad de tipos
    this.authService.updateProfile(actualizaciones as Partial<User>).subscribe({
      next: (usuarioActualizado) => {
        this.message.success('Perfil actualizado correctamente');
        this.usuarioActual.set(usuarioActualizado);
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.message.error('Error al actualizar el perfil. Intente nuevamente.');
      },
      complete: () => {
        this.cargando.set(false);
      }
    });
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
