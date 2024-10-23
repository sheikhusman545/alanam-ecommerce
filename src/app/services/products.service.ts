import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private url = 'https://shopapi.alanaam.qa/api/';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.url + 'ecom/shopping/getproducts');
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.url}ecom/shopping/getproducts?categoryid=${categoryId}&keyword=&sb=&newProductPriority=&featuredProductPriority=`);
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.url}ecom/shopping/viewproduct?productid=${productId}`);
  }
  getFeaturedProducts(): Observable<any> {
    return this.http.get<any>(this.url + 'ecom/shopping/getproducts?featuredProductPriority=1');
  }
  getNewProducts(): Observable<any> {
    return this.http.get<any>(this.url + 'ecom/shopping/getproducts');
  }
  getSearchedProducts(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.url}ecom/shopping/getproducts?keyword=${searchTerm}`);
  }
}
