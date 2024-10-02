import { inject, Injectable } from "@angular/core";
import { HttpClientService } from "./http.service";
import { Observable, of, switchMap ,BehaviorSubject} from "rxjs";
import { UserService } from "./user.service";


@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly _userService = inject(UserService);
    private readonly _httpClient = inject(HttpClientService);
    private tokenSubject$ = new BehaviorSubject<string | null>(localStorage.getItem('JWT_Token'));
    private userDetailsSubject$ = new BehaviorSubject<any | null>(JSON.parse(localStorage.getItem('userDetails')!));
  

    check() {
        const storage = localStorage.getItem(`JWT_Token`);
        if (!storage) {
            return of (false);
        }

        return of (true);
    }

    getToken$() {
        return this.tokenSubject$.asObservable();
      }
    
      getUserDetails$() {
        return this.userDetailsSubject$.asObservable();
      }
    
 
      // Clear stored data
      clearAuthData() {
        localStorage.removeItem('JWT_Token');
        localStorage.removeItem('userDetails');
        this.tokenSubject$.next(null);
        this.userDetailsSubject$.next(null);
      }
}