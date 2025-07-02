import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Product } from '../models/product.model';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'https://api.escuelajs.co/api/v1';
  
  // Estado inicial
  private state = signal<ProductState>({
    products: [],
    loading: false,
    error: null
  });

  // Selectores (señales de solo lectura)
  products = computed(() => this.state().products);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor(private http: HttpClient) {}

  // Cargar todos los productos
  loadProducts(): void {
    this.updateState({ loading: true, error: null });
    
    this.http.get<Product[]>(`${this.API_URL}/products`)
      .pipe(
        tap(products => {
          this.updateState({
            products,
            loading: false
          });
        }),
        catchError(error => {
          this.updateState({
            loading: false,
            error: 'Error al cargar los productos. Intente de nuevo más tarde.'
          });
          throw error;
        })
      )
      .subscribe();
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    this.updateState({ loading: true, error: null });
    
    return this.http.get<Product>(`${this.API_URL}/products/${id}`).pipe(
      tap(() => {
        this.updateState({ loading: false });
      }),
      catchError(error => {
        this.updateState({
          loading: false,
          error: 'Error al cargar el producto.'
        });
        throw error;
      })
    );
  }

  // Actualizar el estado de manera inmutable
  private updateState(partialState: Partial<ProductState>): void {
    this.state.update(current => ({
      ...current,
      ...partialState
    }));
  }
}
