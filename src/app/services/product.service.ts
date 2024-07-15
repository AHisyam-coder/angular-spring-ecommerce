import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { environment } from '../../environments/environment.development';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}products/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}products/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.baseUrl + 'product-category')
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}products/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(
    page: number,
    pageSize: number,
    keyword: string
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}products/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(this.baseUrl + `products/${productId}`);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
