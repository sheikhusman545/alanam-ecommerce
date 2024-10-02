import { Injectable } from '@angular/core';
import { HttpClientService } from './http.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClientService
  ) {
   }

  private token = localStorage.getItem('JWT_Token');  // Retrieve token from localStorage


  getOrders() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,   // Authorization header
      'X-Auth-Token': this.token || ''           // X-Auth-Token header
    });

    return this.http.get('ecom/myaccount/orders', { headers });
  }
}
