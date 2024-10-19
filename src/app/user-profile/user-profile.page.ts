import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientService } from '../services/http.service';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userForm!: FormGroup;
  currentLanguage: string | 'en' | undefined;
  count = 0;
  private token :any = localStorage.getItem('JWT_Token');  // Retrieve token from localStorage
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClientService,
    private router: Router,
    private languageService: LanguageService,
    private cart: CartService,
  ) { }

  ngOnInit() {
    this.cart.cartItemCount$.subscribe((count) => (this.count = count));
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    this.authService.getUserDetails$().subscribe((userDetails) => {
      if (userDetails.customerName) {
        this.userForm.patchValue({
          fullName: userDetails.customerName || '',
          email: userDetails.customerEmail || '',
          mobilePhone: userDetails.customerMobile || ''
        });
      }
    });
  }

  onSubmit() :any {
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('customerName', this.userForm.get('fullName')?.value);
      formData.append('customerEmail', this.userForm.get('email')?.value);
     
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,   
        'X-Auth-Token': this.token || ''           
      });
  
      return this.http.post('ecom/myaccount/updateprofile', formData, { headers }).subscribe((response) => {
      });
    } else {
    }
  }
  navigateToOrders() {
    this.router.navigate(['/orders']);
  }

   logout() {
    this.authService.clearAuthData();
    this.router.navigate(['/tabs/home']);
   }
  
  navigateToHome() {
    this.router.navigate(['/tabs/home']);
  }
  navigateToCart() {
    this.router.navigate(['/tabs/cart']);
  }
}
