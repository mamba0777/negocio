import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterLink } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-maquinas',
  imports: [
    CommonModule, 
    NzCardModule, 
    NzGridModule, 
    NzModalModule, 
    NzButtonModule, 
    NzFormModule, 
    NzInputModule, 
    FormsModule, 
    NzIconModule, 
    RouterLink,
    NzSpinModule,
    NzAlertModule,
    NzEmptyModule,
    NzToolTipModule,
    DecimalPipe
  ],
  templateUrl: './maquinas.component.html',
  styleUrls: ['./maquinas.component.scss']
})
export class MaquinasComponent implements OnInit {
  private productService = inject(ProductService);
  private modal = inject(NzModalService);
  private router = inject(Router);
  
  //aqui se usa las senales
  products = this.productService.products;
  loading = this.productService.loading;
  error = this.productService.error;
  
  // Carrito
  carrito = signal<Product[]>([]);
  
  // Filtros
  searchText = '';
  
  constructor() {}
  
  ngOnInit() {
    this.productService.loadProducts();
  }
  
  // Filtra productos por búsqueda
  get filteredProducts() {
    if (!this.searchText.trim()) {
      return this.products();
    }
    return this.products().filter(product => 
      product.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
  // Agregar al carrito
  addToCart(product: Product) {
    this.carrito.update(items => [...items, product]);
    this.modal.success({
      nzTitle: '¡Producto agregado!',
      nzContent: `${product.title} ha sido agregado al carrito.`,
      nzOkText: 'Aceptar'
    });
  }
  
  // Ver detalles del producto
  verDetalles(product: Product) {
    this.modal.info({
      nzTitle: product.title,
      nzContent: `
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <img src="${product.images[0]}" alt="${product.title}" style="max-width: 100%;">
      `,
      nzOkText: 'Cerrar'
    });
  }
  
  // Para navega en el carro
  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
  
  mostrarModalNuevoProducto() {
    this.modal.info({
      nzTitle: 'Próximamente',
      nzContent: 'Esta funcionalidad estará disponible pronto',
      nzOkText: 'Entendido'
    });
  }

  // Manejar error de carga de imagen
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'https://via.placeholder.com/300x200?text=Error+imagen';
    }
  }
}
