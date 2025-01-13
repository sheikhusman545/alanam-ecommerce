import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // private initiateSessionUrl = 'https://apitest.myfatoorah.com/v2/InitiateSession';
  private executePaymentUrl = 'YOUR_API_URL_FOR_EXECUTE_PAYMENT';
  private url = 'https://shopapi.alanaam.qa/api/';


  // private readonly apiUrl = 'https://apitest.myfatoorah.com/v2/InitiateSession';
  private readonly bearerToken = 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL'; // Truncated for security
  // private apiUrl = 'https://apitest.myfatoorah.com/v2/InitiateSession';
  private token = 'Bearer rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL';
  constructor(private http: HttpClient) { }
  private token_ = localStorage.getItem('JWT_Token');  // Retrieve token from localStorage


  initiatePayment(): Observable<any> {


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,   // Authorization header
      'X-Auth-Token': this.token_ || ''           // X-Auth-Token header
    });

    return this.http.get(this.url + 'ecom/payments/initiatepayment', { headers });
  }

  getEmbeddedSession(): Observable<any> {
    const headers = new HttpHeaders({
      // 'Authorization': `Bearer ${this.token}`,   // Authorization header
      'X-Auth-Token': this.token_ || ''           // X-Auth-Token header
    });

    return this.http.get(this.url + 'ecom/payments/getembeddedsessionid', { headers });
  }

  executeDirectPayment(paymentData: { orderNo: number; methodId: number; IsEmbeddedSupported: boolean }): Observable<any> { 
    const headers = new HttpHeaders({
      'X-Auth-Token': this.token_ || '' // Add your authentication token here
    });
  
    // Construct the query parameters
    const params = new HttpParams()
      .set('orderNo', paymentData.orderNo.toString())
      .set('methodId', paymentData.methodId.toString())
      .set('IsEmbeddedSupported', paymentData.IsEmbeddedSupported.toString());
  
    // Send the GET request
    return this.http.get(this.url + 'ecom/payments/executepayment', { headers, params });
  }

   executePayment(paymentData: { orderNo: number; methodId: number; IsEmbeddedSupported: boolean ,sessionId : string}): Observable<any> { 
    const headers = new HttpHeaders({
      'X-Auth-Token': this.token_ || '' // Add your authentication token here
    });
    const params = new HttpParams()
      .set('orderNo', paymentData.orderNo.toString())
      .set('methodId', paymentData.methodId.toString())
      .set('IsEmbeddedSupported', paymentData.IsEmbeddedSupported.toString())
      .set('embSessionId', paymentData.sessionId.toString());
  
    // Send the GET request
    return this.http.get(this.url + 'ecom/payments/executepayment', { headers, params });
  }
}
