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
  selector: 'app-caballeros',
  imports: [CommonModule, NzCardModule, NzGridModule, NzModalModule, NzButtonModule, NzFormModule, NzInputModule, FormsModule, NzIconModule],
  templateUrl: './caballeros.component.html',
  styleUrls: ['./caballeros.component.scss']
})
export class CaballerosComponent {
  prendas = [
    {
      id: 1,
      nombre: 'Camiseta Deportiva',
      descripcion: 'Camiseta de alto rendimiento para entrenamiento',
      imagen: 'https://mlstaticquic-a.akamaihd.net/camiseta-termica-manga-larga-running-de-hombre-deportes-knex-D_NQ_NP_783852-MLU27453199553_052018-F.jpg',
      caracteristicas: ['Material: Poliéster', 'Tecnología DryFit', 'Control de humedad', 'Tallas: M, L, XL'],
      precio: 40.999
    },
    {
      id: 2,
      nombre: 'Shorts Deportivos',
      descripcion: 'Shorts ligeros para ejercicio y running',
      imagen: 'https://contents.mediadecathlon.com/p1556372/k$c89884cb8332bb082a197bdb85b6ec19/sq/Short+de+cardio+fitness+hombre+FST+100+negro.jpg',
      caracteristicas: ['Material ligero', 'Bolsillos laterales', 'Elástico en cintura', 'Tallas: M, L, XL'],
      precio: 25.999
    },
  ];

  constructor(private modal: NzModalService) {}

  mostrarModalNuevaPrenda(): void {
    this.modal.create({
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
          onClick: () => this.modal.closeAll()
        },
        {
          label: 'Publicar',
          type: 'primary',
          onClick: () => {
            this.modal.closeAll();
          }
        }
      ]
    });
  }

  mostrarDetalles(prenda: any): void {
    this.modal.create({
      nzTitle: prenda.nombre,
      nzContent: `
        <div>
          <img src="${prenda.imagen}" style="max-width: 100%; margin-bottom: 16px;">
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
