import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.services';
import { Product } from '../../models/product.model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  standalone: false
})
export class ProductListComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  // Pagination & Search State
  searchQuery: string = '';
  totalElements: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.searchQuery, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.items;
          this.totalElements = response.totalCount;
        },
        error: (err) => console.error('Failed to load products', err)
      });
  }

  onSearch(): void {
    this.pageIndex = 0; // Reset to first page on search
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
          if (result?.id)
            this.productService.updateProduct(result.id, result).subscribe(() => this.loadProducts());

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
        // Simple logic to go to previous page if we delete the last item on current page
        if (this.dataSource.data.length === 1 && this.pageIndex > 0) {
          this.pageIndex--;
        }
        this.loadProducts();
      });
    }
  }
}
