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
import { Router } from '@angular/router';

@Component({
  selector: 'app-damas',
  imports: [CommonModule, NzCardModule, NzGridModule, NzModalModule, NzButtonModule, NzFormModule, NzInputModule, FormsModule, NzIconModule],
  templateUrl: './damas.component.html',
  styleUrl: './damas.component.scss'
})
export class DamasComponent {
  prendas = [
    {
      id: 1,
      nombre: 'Leggins Deportivos',
      descripcion: 'Leggins de alta compresión para entrenamiento',
      imagen: 'https://www.omeda.es/wp-content/uploads/2020/07/Mallas-deportivas-para-Mujer-alta-cintura-Legging-mujeres-Sexy-transpirable-Feamle-entrenamiento-Leggins-Mujer-2.jpg',
      caracteristicas: ['Material: Poliéster y Spandex', 'Alta compresión', 'Control de humedad', 'Tallas: S, M, L'],
      precio: 29.999
    },
    {
      id: 2,
      nombre: 'Top Deportivo',
      descripcion: 'Top deportivo con soporte medio para ejercicio',
      imagen: 'https://womensecret.com/on/demandware.static/-/Sites-gc-ws-master-catalog/default/dwc5df2ad4/images/hi-res/P_423265547FM.jpg',
      caracteristicas: ['Soporte medio', 'Material transpirable', 'Diseño sin costuras', 'Tallas: S, M, L'],
      precio: 24.999
    },
  ];

  constructor(private router: Router, private modalService: NzModalService) {}

  mostrarModalNuevaPrenda(): void {
    this.modalService.create({
      nzTitle: 'Publicar Nueva Prenda',
      nzContent: `
        <form style="padding: 20px 0;">
          <div style="margin-bottom: 16px;">
            <label>Nombre de la prenda:</label>
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

          <div style="margin-bottom: 16px;">
            <label>Precio:</label>
            <input nz-input type="number" placeholder="Ingrese el precio" style="width: 100%; margin-top: 8px;">
          </div>
        </form>
      `,
      nzWidth: '600px',
      nzFooter: [
        {
          label: 'Cancelar',
          onClick: () => this.modalService.closeAll()
        },
        {
          label: 'Publicar',
          type: 'primary',
          onClick: () => {
            this.modalService.closeAll();
          }
        }
      ]
    });
  }

  mostrarDetalles(prenda: any) {
    this.modalService.create({
      nzTitle: prenda.nombre,
      nzContent: `
        <div class="modal-content">
          <img src="${prenda.imagen}" class="modal-image">
          <p>${prenda.descripcion}</p>
          <h4>Características:</h4>
          <ul>
            ${prenda.caracteristicas.map((c: string) => `<li>${c}</li>`).join('')}
          </ul>
          <h4>Precio:</h4>
          <p style="font-size: 18px; color: #1890ff;">$${prenda.precio}</p>
        </div>
      `,
      nzWidth: '600px',
      nzFooter: null
    });
  }
}
