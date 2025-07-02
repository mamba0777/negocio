import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: '/auth/login' 
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth/auth.component').then(m => m.AuthComponent),
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        data: {
          header: 'Iniciar sesión',
          subheader: 'Ingresa tus credenciales para acceder a tu cuenta'
        }
      },
      { 
        path: 'registro', 
        loadChildren: () => import('./pages/registro/registro.routes').then(m => m.REGISTRO_ROUTES),
        data: {
          header: 'Crear cuenta',
          subheader: 'Regístrate para comenzar a usar nuestra plataforma'
        }
      }
    ]
  },
  { 
    path: 'welcome', 
    loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) 
  },
  { 
    path: 'maquinas', 
    loadChildren: () => import('./pages/maquinas/maquinas.routes').then(m => m.MAQUINAS_ROUTES) 
  },
  { 
    path: 'suplementos', 
    loadChildren: () => import('./pages/suplementos/suplementos.routes').then(m => m.SUPLEMENTOS_ROUTES) 
  },
  { 
    path: 'gashets', 
    loadChildren: () => import('./pages/gashets/gashets.routes').then(m => m.GASHETS_ROUTES) 
  },
  { 
    path: 'caballeros', 
    loadChildren: () => import('./pages/caballeros/caballeros.routes').then(m => m.CABALLEROS_ROUTES) 
  },
  { 
    path: 'damas', 
    loadChildren: () => import('./pages/damas/damas.routes').then(m => m.DAMAS_ROUTES) 
  },
  { 
    path: 'carrito', 
    loadChildren: () => import('./pages/carrito/carriito.routes').then(m => m.CARROTI_ROUTES) 
  }
];
