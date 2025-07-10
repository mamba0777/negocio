import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
<<<<<<< HEAD
import { NzModalService } from 'ng-zorro-antd/modal';
=======
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
<<<<<<< HEAD
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-registro',
=======
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    NzFormModule, 
    NzInputModule, 
    NzButtonModule, 
    NzCardModule,
    NzIconModule,
<<<<<<< HEAD
    NzTableModule,
    NzTagModule,
    NzDividerModule,
    NzSelectModule,
=======
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
    RouterModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
<<<<<<< HEAD
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private router = inject(Router);

  // Estado del componente
  modo = signal<'lista' | 'formulario'>('lista');
  cargando = signal(false);
  passwordVisible = false;
  confirmarPasswordVisible = false;
  editandoUsuario = signal<ApiUser | null>(null);
  private formSubmitted = false;
  private isNavigatingAway = false;
=======
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // Estado del componente
  modo = signal<'registro' | 'perfil'>('registro');
  cargando = signal(false);
  usuarioActual = signal<User | null>(null);
  passwordVisible = false;
  confirmarPasswordVisible = false;
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de

  // Formulario reactivo
  form!: FormGroup;

<<<<<<< HEAD
  // Estado para la tabla de usuarios
  listOfData: ApiUser[] = [];
  loading = signal(false);

  // Computed properties
  esLista = computed(() => this.modo() === 'lista');
  esRegistro = computed(() => this.modo() === 'formulario' && !this.editandoUsuario());
  titulo = computed(() => this.esLista() ? 'Gestión de Usuarios' : (this.editandoUsuario() ? 'Editar Usuario' : 'Nuevo Usuario'));
  textoBoton = computed(() => this.editandoUsuario() ? 'Actualizar' : 'Registrar');

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.http.get<ApiUser[]>('https://api.escuelajs.co/api/v1/users')
      .subscribe({
        next: (usuarios) => {
          this.listOfData = usuarios;
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.message.error('Error al cargar la lista de usuarios');
          this.loading.set(false);
        }
      });
  }
  
  // Métodos para la tabla de usuarios
  mostrarFormularioNuevo(): void {
    this.editandoUsuario.set(null);
    this.modo.set('formulario');
    this.form.reset({
      avatar: 'https://api.lorem.space/image/face?w=150&h=150',
      role: 'customer' // Valor por defecto para nuevo usuario
    });
  }

  volverALista(): void {
    // Si el formulario no ha sido enviado y tiene cambios, mostrar confirmación
    if (this.form.dirty && !this.formSubmitted) {
      this.modal.confirm({
        nzTitle: '¿Estás seguro?',
        nzContent: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?',
        nzOkText: 'Sí, salir',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.isNavigatingAway = true;
          this.resetFormAndGoToList();
          return Promise.resolve();
        },
        nzCancelText: 'Cancelar',
        nzOnCancel: () => Promise.resolve()
      });
    } else {
      this.resetFormAndGoToList();
    }
  }

  private resetFormAndGoToList(): void {
    this.modo.set('lista');
    this.editandoUsuario.set(null);
    this.form.reset();
    this.formSubmitted = false;
    this.isNavigatingAway = false;
  }

  editarUsuario(usuario: ApiUser): void {
    this.editandoUsuario.set(usuario);
    this.modo.set('formulario');
    this.form.patchValue({
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      avatar: usuario.avatar
    });
  }

  eliminarUsuario(id: number): void {
    // Aquí iría la lógica para eliminar el usuario
    this.message.info('Función de eliminar usuario será implementada');
  }

  getRoleColor(role: string): string {
    const roles: { [key: string]: string } = {
      'admin': 'red',
      'customer': 'blue',
      'user': 'green',
      'customer_service': 'orange'
    };
    return roles[role.toLowerCase()] || 'default';
  }

  private inicializarFormulario(): void {
=======
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
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
<<<<<<< HEAD
        Validators.minLength(6)
      ]],
      confirmarPassword: ['', [Validators.required]],
      role: ['customer', [Validators.required]],
=======
        Validators.minLength(6),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]],
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
      avatar: ['https://api.lorem.space/image/face?w=150&h=150'] // Avatar por defecto
    }, { validators: this.passwordMatchValidator() });
  }

<<<<<<< HEAD
  private passwordStrengthValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      
      // Solo verificamos que tenga al menos 6 caracteres
      if (password && password.length < 6) {
        return { minlength: { requiredLength: 6, actualLength: password.length } };
=======
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
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
      }

      return null;
    };
  }

  private passwordMatchValidator() {
<<<<<<< HEAD
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const confirmarPassword = formGroup.get('confirmarPassword');

      if (!password || !confirmarPassword) {
=======
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) {
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
        return null;
      }

      const passwordValue = password.value;
<<<<<<< HEAD
      const confirmarPasswordValue = confirmarPassword.value;

      // Si estamos editando un usuario y ambos campos de contraseña están vacíos, no mostrar error
      if (this.editandoUsuario() && !passwordValue && !confirmarPasswordValue) {
        return null;
      }

      // Si las contraseñas no coinciden
      if (passwordValue !== confirmarPasswordValue) {
        confirmarPassword.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        // Limpiar errores si las contraseñas coinciden
        if (confirmarPassword.hasError('mismatch')) {
          confirmarPassword.setErrors(null);
        }
        return null;
      }
    };
  }

  onSubmit(event?: Event): void {
    // Prevenir el comportamiento por defecto del formulario
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Si ya se está procesando el formulario, no hacer nada
    if (this.cargando()) {
      return;
    }

    // Marcar todos los controles como touched para mostrar errores
=======
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
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
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
<<<<<<< HEAD
    this.formSubmitted = true;

    if (this.editandoUsuario()) {
      this.actualizarUsuario();
    } else {
      this.registrarUsuario();
    }
  }

  private actualizarUsuario(): void {
    if (!this.editandoUsuario()?.id) {
      this.message.error('No se puede actualizar el usuario: ID no válido');
      this.cargando.set(false);
      return;
    }

    const { confirmPassword, ...userData } = this.form.value;

    this.authService.updateProfile(userData).subscribe({
      next: (usuario: any) => {
        this.message.success('¡Usuario actualizado exitosamente!');
        this.volverALista();
        this.cargarUsuarios();
      },
      error: (error: any) => {
        console.error('Error al actualizar usuario:', error);
        const errorMessage = error.error?.message || error.message || 'Error al actualizar el usuario';
        this.message.error(errorMessage);
        this.cargando.set(false);
      }
    });
  }

=======

    if (this.esRegistro()) {
      this.registrarUsuario();
    } else {
      this.actualizarPerfil();
    }
  }

>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
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
<<<<<<< HEAD
      next: () => {
        this.message.success('Perfil actualizado correctamente');
        this.volverALista();
        this.cargarUsuarios();
=======
      next: (usuario) => {
        this.usuarioActual.set(usuario);
        this.message.success('Perfil actualizado correctamente');
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
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
<<<<<<< HEAD
 
=======
>>>>>>> 85f4d38b45d1c70def789b25db2005f90f9b03de
