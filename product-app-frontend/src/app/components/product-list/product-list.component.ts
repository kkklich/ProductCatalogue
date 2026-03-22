import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product.services';
import { Product } from '../../models/product.model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  standalone: false
})
export class ProductListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['code', 'name', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  searchQuery: string = '';
  totalElements: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  isLoading: boolean = false;

  sortBy: string = '';
  sortDirection: string = '';

  private searchSubject = new Subject<string>();
  private loadData$ = new BehaviorSubject<void>(undefined);
  private subscriptions = new Subscription();

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchSubject.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(() => {
        this.pageIndex = 0;
        this.loadProducts();
      })
    );

    this.subscriptions.add(
      this.loadData$.pipe(
        tap(() => this.isLoading = true),
        switchMap(() =>
          this.productService.getProducts(this.searchQuery, this.pageIndex, this.pageSize, this.sortBy, this.sortDirection).pipe(
            finalize(() => this.isLoading = false),
            catchError(err => {
              console.error('Failed to load products', err);
              return of(null);
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

  onSortChange(sortState: Sort): void {
    this.sortBy = sortState.active;
    this.sortDirection = sortState.direction; // 'asc', 'desc' or '' 
    this.pageIndex = 0; // after sorting, we want to go back to the first page
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.loadData$.next();
  }

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

    dialogRef.afterClosed().subscribe((result: { id?: string, payload: any } | null) => {
      if (result) {
        if (this.isEditMode(result)) {
          // Edit Mode
          this.productService.updateProduct(result.id, result.payload).subscribe(() => this.loadProducts());
        } else {
          // Add Mode 
          this.productService.addProduct(result.payload).subscribe(() => this.loadProducts());
        }
      }
    });
  }

  private isEditMode(result: any): result is { id: string, payload: any } {
    return result.id !== undefined;
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