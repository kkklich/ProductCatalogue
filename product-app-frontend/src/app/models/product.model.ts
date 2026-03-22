export interface Product {
  id?: string;
  code: string;
  name: string;
  price: number;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  price: number;
}

export interface UpdateProductRequest {
  code: string;
  name: string;
  price: number;
}
