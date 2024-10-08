import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = 'https://shopapi.alanaam.qa/api/ecom/shopping/';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getcategories?maincategories=YES');
  }
  
  getSubCategories(categoryId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getcategories?parentcategoryid=' + categoryId);
  }
}
