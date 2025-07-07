import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
    // Verificar si el usuario está autenticado para determinar el modo
    const usuario = this.authService.user();
    if (usuario) {
      this.modo.set('perfil');
      this.usuarioActual.set(usuario);
      this.inicializarFormularioPerfil(usuario);
    } else {
      this.inicializarFormularioRegistro();
    }
  }

  private inicializarFormularioRegistro(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]],
      avatar: ['https://api.lorem.space/image/face?w=150&h=150'] // Avatar por defecto
    }, { validators: this.passwordMatchValidator() });
  }

  private inicializarFormularioPerfil(usuario: User): void {
    this.form = this.fb.group({
      name: [usuario?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [
        { value: usuario?.email || '', disabled: true },
        [Validators.required, Validators.email]
      ],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      avatar: [usuario?.avatar || 'https://api.lorem.space/image/face?w=150&h=150']
    }, { validators: this.passwordMatchValidator() });
  }

  private passwordStrengthValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/.test(password);

      if (!hasLetter || !hasNumber || !hasSpecialCharacter) {
        return { passwordStrength: true };
      }

      return null;
    };
  }

  private passwordMatchValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      const passwordValue = password.value;
      const confirmPasswordValue = confirmPassword.value;

      // Si estamos en modo edición y ambos campos están vacíos, no mostrar error
      if (this.modo() === 'perfil' && !passwordValue && !confirmPasswordValue) {
        return null;
      }

      // Si estamos en modo registro o se está cambiando la contraseña
      if (passwordValue !== confirmPasswordValue) {
        return { mismatch: true };
      }

      return null;
    };
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

    if (this.esRegistro()) {
      this.registrarUsuario();
    } else {
      this.actualizarPerfil();
    }
  }

  private registrarUsuario(): void {
    const { confirmPassword, ...userData } = this.form.value;
    
    this.authService.register(userData).subscribe({
      next: (usuario) => {
        this.message.success('¡Registro exitoso! Por favor inicia sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        const errorMessage = error.error?.message || error.message || 'Error al registrar el usuario';
        this.message.error(errorMessage);
        this.cargando.set(false);
      },
      complete: () => {
        this.cargando.set(false);
      }
    });
  }

  private actualizarPerfil(): void {
    const { confirmPassword, ...updates } = this.form.value;
    
    this.authService.updateProfile(updates).subscribe({
      next: (usuario) => {
        this.usuarioActual.set(usuario);
        this.message.success('Perfil actualizado correctamente');
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        const errorMessage = error.error?.message || error.message || 'Error al actualizar el perfil';
        this.message.error(errorMessage);
      },
      complete: () => {
        this.cargando.set(false);
      }
    });
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
