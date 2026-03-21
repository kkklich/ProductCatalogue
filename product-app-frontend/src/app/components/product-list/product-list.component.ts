import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.services';
import { Product } from '../../models/product.model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  standalone: false
})
export class ProductListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['code', 'name', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  // Pagination & Search State
  searchQuery: string = '';
  totalElements: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  // Loader State
  isLoading: boolean = false;

  // RxJS Streams do zarządzania odpytywaniem API
  private searchSubject = new Subject<string>();
  private loadData$ = new BehaviorSubject<void>(undefined);
  private subscriptions = new Subscription();

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // 1. Logika debounce dla wpisywania w wyszukiwarkę (2 sekundy)
    this.subscriptions.add(
      this.searchSubject.pipe(
        debounceTime(2000), // Czeka 2 sekundy po ostatnim wpisaniu znaku
        distinctUntilChanged() // Sprawdza, czy wartość faktycznie się zmieniła
      ).subscribe(() => {
        this.pageIndex = 0; // Reset strony przy nowym wyszukiwaniu
        this.loadProducts(); // Uruchamia odpytanie API
      })
    );

    // 2. Główny mechanizm pobierania danych (SwitchMap uchroni przed wielokrotnymi zapytaniami)
    this.subscriptions.add(
      this.loadData$.pipe(
        tap(() => this.isLoading = true), // Ustawienie loadera na true przed wywołaniem API
        switchMap(() =>
          this.productService.getProducts(this.searchQuery, this.pageIndex, this.pageSize).pipe(
            finalize(() => this.isLoading = false), // Ustawienie loadera na false po zakończeniu (sukces lub błąd)
            catchError(err => {
              console.error('Failed to load products', err);
              return of(null); // Zwraca puste zapytanie w przypadku błędu, aby nie zepsuć strumienia
            })
          )
        )
      ).subscribe(response => {
        if (response) {
          this.dataSource.data = response.items;
          this.totalElements = response.totalCount;
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Czyszczenie subskrypcji, aby uniknąć wycieków pamięci
    this.subscriptions.unsubscribe();
  }

  // Odświeżenie danych zlecane do strumienia
  loadProducts(): void {
    this.loadData$.next();
  }

  // Funkcja wywoływana przy każdej zmianie wartości w input
  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  onEnterSearch(): void {
    this.pageIndex = 0;
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  openProductDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe((result: Product | null) => {
      if (result) {
        if (product) {
          // Edit Mode
          if (result?.id) {
            this.productService.updateProduct(result.id, result).subscribe(() => this.loadProducts());
          }
        } else {
          // Add Mode
          this.productService.addProduct(result).subscribe(() => this.loadProducts());
        }
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
          this.pageIndex--;
        }
        this.loadProducts();
      });
    }
  }
}