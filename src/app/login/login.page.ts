import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services/http.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  phoneForm: FormGroup;
  otpForm: FormGroup;
  showOtpModal = false; // Toggle OTP modal visibility
  userDetails: any;
  jwtToken: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClientService,
    private navCtrl: NavController,
    private router: Router,
    public toastController: ToastController
  ) {
    // Initialize phone number form
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$'), Validators.maxLength(8), Validators.minLength(8)]], // Phone number regex
    });

    // Initialize OTP form with 6 controls, each for a single digit
    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
      otp5: ['', [Validators.required, Validators.maxLength(1)]],
      otp6: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  // Function to send OTP after validating phone number
  sendOTP() {
    if (this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('phoneNumber')?.value;
      const formData = new FormData();
      formData.append('username', phoneNumber);
      this.http.post('ecom/generateotp', formData).subscribe((response) => {
        console.log(response);
      }); // Adjust the URL
      console.log('Sending OTP to:', phoneNumber);
      this.showOtpModal = true; // Show OTP modal after sending OTP
    }
  }

  moveToNext(event: any, nextControl: string) {
    const input = event.target.value;
    if (input.length === 1 && nextControl) {
      const nextElement = document.querySelector(`[formControlName="${nextControl}"]`);
      if (nextElement) {
        (nextElement as HTMLInputElement).focus();
      }
    }
  }

  verifyOTP() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      const formData = new FormData();
      formData.append('mobileNumber', this.phoneForm.get('phoneNumber')?.value);
      formData.append('otp', otp);
      formData.append('devicetype', 'app-anrdoid');
      this.http.post('ecom/login', formData).subscribe((response) => {
        console.log(response);
        if (response.respondStatus == 'SUCCESS') {
          this.userDetails = response.requestedData.userDetails;
          this.jwtToken = response.requestedData.JWT_Token;
          localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
          localStorage.setItem("JWT_Token", this.jwtToken);
          this.router.navigate(['/tabs/home']);
          console.log('User logged in:', this.userDetails);
          console.log('JWT Token:', this.jwtToken);
        } else {
          this.toastMessage('Invalid OTP');
        }


      }); // Adjust the URL
      const userDetails = localStorage.getItem('userDetails');
      if (userDetails) {
        console.log(JSON.parse(userDetails));
      } else {
        console.log('No user details found in localStorage');
      }
    }
  }

  // Close modal when clicking outside the OTP box
  closeModal(event: any) {
    this.showOtpModal = false;
  }
  onBack() {
    this.navCtrl.back();
  }
  
  async toastMessage(msg: string) {
    const toast = await this.toastController.create({
      message: 'OTP is invalid',
      duration: 2000,
      position: 'top', // You can change this to 'top' or 'middle'
      color: 'light', // Customize the toast color if needed
    });

    await toast.present();
  }
}

