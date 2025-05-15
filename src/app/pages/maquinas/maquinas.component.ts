import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-maquinas',
  imports: [CommonModule, NzCardModule, NzGridModule, NzModalModule, NzButtonModule, NzFormModule, NzInputModule, FormsModule, NzIconModule],
  templateUrl: './maquinas.component.html',
  styleUrl: './maquinas.component.scss'
})
export class MaquinasComponent {
  maquinas = [
    {
      id: 1,
      nombre: 'Máquina de Press Banca',
      descripcion: 'Máquina ideal para ejercicios de pecho',
      imagen: 'https://th.bing.com/th/id/R.3e725d78b237dea3dbfdc760ffdf2ac4?rik=UaaR2oTSierraA&riu=http%3a%2f%2fwww.corpomachine.com%2fFiles%2f48757%2fImg%2f10%2fpress-de-banca-Megatec-2-fitness-0001-zoom.jpg&ehk=fxiJ%2fDVGyXffCUKHaeurmwU6oxe4wU1ieJiMbGtcJew%3d&risl=&pid=ImgRaw&r=0',
      caracteristicas: ['Peso máximo: 150kg', 'Ajuste de altura', 'Incluye soporte de seguridad']
    },
    {
      id: 2,
      nombre: 'Máquina de Sentadillas',
      descripcion: 'Perfecta para ejercicios de pierna',
      imagen: 'https://kaizenstorecr.com/wp-content/uploads/2024/03/IMG-20240229-WA0011.jpg',
      caracteristicas: ['Peso máximo: 200kg', 'Barra guiada', 'Sistema de seguridad']
    },
    {
      id: 3,
      nombre: 'Máquina de Press Banca',
      descripcion: 'Máquina ideal para ejercicios de pecho',
      imagen: 'https://th.bing.com/th/id/R.3e725d78b237dea3dbfdc760ffdf2ac4?rik=UaaR2oTSierraA&riu=http%3a%2f%2fwww.corpomachine.com%2fFiles%2f48757%2fImg%2f10%2fpress-de-banca-Megatec-2-fitness-0001-zoom.jpg&ehk=fxiJ%2fDVGyXffCUKHaeurmwU6oxe4wU1ieJiMbGtcJew%3d&risl=&pid=ImgRaw&r=0',
      caracteristicas: ['Peso máximo: 150kg', 'Ajuste de altura', 'Incluye soporte de seguridad']
    },
    {
      id: 4,
      nombre: 'Máquina de Sentadillas',
      descripcion: 'Perfecta para ejercicios de pierna',
      imagen: 'https://kaizenstorecr.com/wp-content/uploads/2024/03/IMG-20240229-WA0011.jpg',
      caracteristicas: ['Peso máximo: 200kg', 'Barra guiada', 'Sistema de seguridad']
    },
    {
      id: 5,
      nombre: 'Máquina de Press Banca',
      descripcion: 'Máquina ideal para ejercicios de pecho',
      imagen: 'https://th.bing.com/th/id/R.3e725d78b237dea3dbfdc760ffdf2ac4?rik=UaaR2oTSierraA&riu=http%3a%2f%2fwww.corpomachine.com%2fFiles%2f48757%2fImg%2f10%2fpress-de-banca-Megatec-2-fitness-0001-zoom.jpg&ehk=fxiJ%2fDVGyXffCUKHaeurmwU6oxe4wU1ieJiMbGtcJew%3d&risl=&pid=ImgRaw&r=0',
      caracteristicas: ['Peso máximo: 150kg', 'Ajuste de altura', 'Incluye soporte de seguridad']
    },
    {
      id: 6,
      nombre: 'Máquina de Sentadillas',
      descripcion: 'Perfecta para ejercicios de pierna',
      imagen: 'https://kaizenstorecr.com/wp-content/uploads/2024/03/IMG-20240229-WA0011.jpg',
      caracteristicas: ['Peso máximo: 200kg', 'Barra guiada', 'Sistema de seguridad']
    },
    {
      id: 7,
      nombre: 'Máquina de Press Banca',
      descripcion: 'Máquina ideal para ejercicios de pecho',
      imagen: 'https://th.bing.com/th/id/R.3e725d78b237dea3dbfdc760ffdf2ac4?rik=UaaR2oTSierraA&riu=http%3a%2f%2fwww.corpomachine.com%2fFiles%2f48757%2fImg%2f10%2fpress-de-banca-Megatec-2-fitness-0001-zoom.jpg&ehk=fxiJ%2fDVGyXffCUKHaeurmwU6oxe4wU1ieJiMbGtcJew%3d&risl=&pid=ImgRaw&r=0',
      caracteristicas: ['Peso máximo: 150kg', 'Ajuste de altura', 'Incluye soporte de seguridad']
    },
    {
      id: 8,
      nombre: 'Máquina de Sentadillas',
      descripcion: 'Perfecta para ejercicios de pierna',
      imagen: 'https://kaizenstorecr.com/wp-content/uploads/2024/03/IMG-20240229-WA0011.jpg',
      caracteristicas: ['Peso máximo: 200kg', 'Barra guiada', 'Sistema de seguridad']
    },
    
    
    
  ];

  constructor(private modal: NzModalService) {}

  mostrarModalNuevaMaquina(): void {
    this.modal.create({
      nzTitle: 'Publicar Nueva Máquina',
      nzContent: `
        <form style="padding: 20px 0;">
          <div style="margin-bottom: 16px;">
            <label>Nombre de la máquina:</label>
            <input nz-input placeholder="Ingrese el nombre" style="width: 100%; margin-top: 8px;">
          </div>
          
          <div style="margin-bottom: 16px;">
            <label>Descripción:</label>
            <textarea nz-input placeholder="Ingrese la descripción" style="width: 100%; margin-top: 8px;" rows="4"></textarea>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label>URL de la imagen:</label>
            <input nz-input placeholder="Ingrese la URL de la imagen" style="width: 100%; margin-top: 8px;">
          </div>
          
          <div style="margin-bottom: 16px;">
            <label>Características:</label>
            <textarea nz-input placeholder="Ingrese las características (una por línea)" style="width: 100%; margin-top: 8px;" rows="4"></textarea>
          </div>
        </form>
      `,
      nzWidth: '600px',
      nzFooter: [
        {
          label: 'Cancelar',
          onClick: () => this.modal.closeAll()
        },
        {
          label: 'Publicar',
          type: 'primary',
          onClick: () => {
            this.modal.closeAll();
            // gurdar la nueva maquina
  
          }
        }
      ]
    });
  }

  mostrarDetalles(maquina: any): void {
    this.modal.create({
      nzTitle: maquina.nombre,
      nzContent: `
        <div>
          <img src="${maquina.imagen}" style="max-width: 100%; margin-bottom: 16px;">
          <p>${maquina.descripcion}</p>
          <h4>Características:</h4>
          <ul>
            ${maquina.caracteristicas.map((c: string) => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      `,
      nzWidth: '600px',
      nzFooter: null
    });
  }
}
