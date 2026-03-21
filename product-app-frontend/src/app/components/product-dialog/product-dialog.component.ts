import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-dialog',
  standalone: false,
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {

  isEditMode: boolean = false;

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
      this.productForm.patchValue({
        code: this.data.code,
        name: this.data.name,
        price: this.data.price
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData: Product = {
        id: this.isEditMode && this.data ? this.data.id : crypto.randomUUID(),
        code: this.productForm.value.code!,
        name: this.productForm.value.name!,
        price: this.productForm.value.price!
      };

      // We don't call the API here anymore. We just return the data!
      this.dialogRef.close(productData);
    }
  }

  closeModal() {
    this.dialogRef.close(null); // Return null on cancel
  }
}