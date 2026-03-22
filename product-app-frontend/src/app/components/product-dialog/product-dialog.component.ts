import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product, CreateProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-product-dialog',
  standalone: false,
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {
  isEditMode: boolean = false;
  private editProductId?: string;

  productForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(3)]),
    name: new FormControl('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)])
  });

  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | undefined
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.editProductId = this.data.id;
      this.productForm.patchValue({
        code: this.data.code,
        name: this.data.name,
        price: this.data.price
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {

      const productPayload: CreateProductRequest = {
        code: this.productForm.value.code!,
        name: this.productForm.value.name!,
        price: this.productForm.value.price!
      };

      if (this.isEditMode) {
        this.dialogRef.close({ id: this.editProductId, payload: productPayload });
      } else {
        this.dialogRef.close({ payload: productPayload });
      }
    }
  }

  closeModal() {
    this.dialogRef.close(null);
  }
}