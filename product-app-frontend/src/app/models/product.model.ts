export interface Product {
  id?: string;
  code: string;
  name: string;
  price: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}