import { inject, Injectable } from "@angular/core";
import { HttpClientService } from "./http.service";
import { Observable, of, switchMap, BehaviorSubject } from "rxjs";
import { UserService } from "./user.service";
import { HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly _userService = inject(UserService);
  private readonly _httpClient = inject(HttpClientService);
  //import http service
  private tokenSubject$ = new BehaviorSubject<string | null>(localStorage.getItem('JWT_Token'));
  private userDetailsSubject$ = new BehaviorSubject<any | null>(JSON.parse(localStorage.getItem('userDetails')!));

  private token = localStorage.getItem('JWT_Token');  // Retrieve token from localStorage

  check(): Observable<boolean> {
    const storage = localStorage.getItem('JWT_Token');
    return of(!!storage); // Returns true if JWT_Token exists, false otherwise
  }

  getToken$() {
    return this.tokenSubject$.asObservable();
  }

  getUserDetails$() {
    return this.userDetailsSubject$.asObservable();
  }

  // deleteUser
  deleteUser(id: any, headers: HttpHeaders) {
    return this._httpClient.post(`ecom/myaccount/deleteaddress/` + id, {}  ,{ headers });
  }

  // Clear stored data
  clearAuthData() {
    localStorage.removeItem('JWT_Token');
    localStorage.removeItem('userDetails');
    this.tokenSubject$.next(null);
    this.userDetailsSubject$.next(null);
  }
}
