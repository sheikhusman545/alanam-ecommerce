import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientService } from '../services/http.service';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { CartService } from '../services/cart.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userForm!: FormGroup;
  currentLanguage: string | 'en' | undefined;
  count = 0;
   ID: any = '';
  private token: any = localStorage.getItem('JWT_Token');  // Retrieve token from localStorage
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClientService,
    private router: Router,
    private languageService: LanguageService,
    private cart: CartService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cart.cartItemCount$.subscribe((count) => (this.count = count));
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    // this.authService.getUserDetails$().subscribe((userDetails) => {
    //   if (userDetails.customerID) {
    //     this.userForm.patchValue({
    //       fullName: userDetails.customerName || '',
    //       email: userDetails.customerEmail || '',
    //       mobilePhone: userDetails.customerMobile || ''
    //     });
    //   }
    // });
    //user locastorage  data
    const userDetails = JSON.parse(localStorage.getItem('userDetails')!);
    if (userDetails) {
      this.ID = userDetails.customerID || '';

      this.userForm.patchValue({
        fullName: userDetails.customerName || '',
        email: userDetails.customerEmail || '',
        mobilePhone: userDetails.customerMobile || ''
      });
    }
        
  }

  onSubmit(): any {
    if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('customerName', this.userForm.get('fullName')?.value);
      formData.append('customerEmail', this.userForm.get('email')?.value);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'X-Auth-Token': this.token || ''
      });

      return this.http.post('ecom/myaccount/updateprofile', formData, { headers }).subscribe((response) => {
        if (response.respondStatus == "SUCCESS") {
          const userDetails = JSON.parse(localStorage.getItem('userDetails')!);
          userDetails.customerName = this.userForm.get('fullName')?.value;
          userDetails.customerEmail = this.userForm.get('email')?.value;
          userDetails.customerMobile = this.userForm.get('mobilePhone')?.value;
          localStorage.setItem('userDetails', JSON.stringify(userDetails));
          this.toastMessage('Profile updated successfully');
        } else {
          this.toastMessage('Failed to update profile');
        }

      });
    } else {
      this.toastMessage('Form is invalid');
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
  async toastMessage(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'light',
    });

    await toast.present();
  }

  async deleteAccount() {
    if (!this.ID) {
      console.error('User ID is undefined; cannot delete account.');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.confirmDeleteAccount();
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  
  confirmDeleteAccount() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'X-Auth-Token': this.token || ''
    });
    this.authService.deleteUser(this.ID,headers).subscribe((res) => {
      if (res.respondStatus == "SUCCESS") {
        this.authService.clearAuthData();
        this.presentAlert('We regret to see you go. Your account has been deleted.');
        this.router.navigate(['/tabs/home']);
      } else {
        this.presentAlert('Failed to delete account');
      }
    });
  }
  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Account Deletion',
      message: msg,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
