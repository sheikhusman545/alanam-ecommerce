import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services/http.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneForm: FormGroup;
  otpForm: FormGroup;
  showOtpModal = false; // Toggle OTP modal visibility
  userDetails: any;
  jwtToken: any = null;
  currentLanguage: string | 'en' | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClientService,
    private navCtrl: NavController,
    private router: Router,
    public toastController: ToastController,
    private languageService: LanguageService
  ) {
    // Initialize phone number form
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$'), Validators.maxLength(8), Validators.minLength(8)]], // Phone number regex
    });

    // Initialize OTP form with 6 controls, each for a single digit
    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.maxLength(6)]],
        });
  }
  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  sendOTP() {
    if (this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;
      const formData = new FormData();
      formData.append('username', phoneNumber);
      this.http.post('ecom/generateotp', formData).subscribe((response) => {
      }); 
      this.showOtpModal = true; 
    }
  }

  // moveToNext(event: any, nextControl: string) {
  //   const input = event.target.value;
  //   if (input.length === 1 && nextControl) {
  //     const nextElement = document.querySelector(`[formControlName="${nextControl}"]`);
  //     if (nextElement) {
  //       (nextElement as HTMLInputElement).focus();
  //     }
  //   }
  // }

  verifyOTP() {
    if (this.otpForm.valid) {
     // const otp = ;
      const formData = new FormData();
      formData.append('mobileNumber', this.phoneForm.get('phoneNumber')?.value);
      formData.append('otp', this.otpForm.get('otp1')?.value);
      formData.append('devicetype', 'app-anrdoid');
      this.http.post('ecom/login', formData).subscribe((response) => {
        if (response.respondStatus == 'SUCCESS') {
          this.userDetails = response.requestedData.userDetails;
          this.jwtToken = response.requestedData.JWT_Token;
          localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
          localStorage.setItem("JWT_Token", this.jwtToken);
          this.otpForm.reset();
          this.router.navigate(['/tabs/home']);

        } else {
          this.toastMessage('Invalid OTP');
        }
      }); 
    }
  }

  closeModal(event: any) {
    //clear all form value in otp form
    this.otpForm.reset();
    this.showOtpModal = false;
  }
  onBack() {
    this.navCtrl.back();
  }
  
  async toastMessage(msg: string) {
    const toast = await this.toastController.create({
      message: 'OTP is invalid',
      duration: 2000,
      position: 'top',
      color: 'light', 
    });

    await toast.present();
  }
}

