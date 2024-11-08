import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class HttpClientService {

    private readonly _apiToken: string | null = null;
    private readonly apiBasePath = 'https://shopapi.alanaam.qa/api';
   // private readonly apiBasePath = 'http://shopapi.local:8080/api';

    constructor(private readonly _httpClient: HttpClient) {
        this._apiToken = localStorage.getItem('JWT_Token');
    }

    get(url: string, options?: any): Observable<any> {
        return this._httpClient.get(`${this.apiBasePath}/${url}`, options);
    }

    post(url: string, body: any,options?:any): Observable<any> {
        return this._httpClient.post(`${this.apiBasePath}/${url}`, body,options);
    }

    put(url: string, body: any): Observable<any> {
        return this._httpClient.put(`${this.apiBasePath}/${url}`, body);
    }

    patch(url: string, body: any): Observable<any> {
        return this._httpClient.patch(`${this.apiBasePath}/${url}`, body);
    }

    delete(url: string, body: any): Observable<any> {
        return this._httpClient.delete(`${this.apiBasePath}/${url}`, body);
    }
}
