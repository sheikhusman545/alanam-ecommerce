import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services/http.service';
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
  jwtToken: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClientService
  ) {
    // Initialize phone number form
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]], // Phone number regex
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
      // Implement the OTP sending logic here
      this.showOtpModal = true; // Show OTP modal after sending OTP
    }
  }

  // Function to automatically move focus to the next input field
  moveToNext(event: any, nextControl: string) {
    const input = event.target.value;
    if (input.length === 1 && nextControl) {
      const nextElement = document.querySelector(`[formControlName="${nextControl}"]`);
      if (nextElement) {
        (nextElement as HTMLInputElement).focus();
      }
    }
  }

  // Function to verify OTP after it's entered
  verifyOTP() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      const formData = new FormData();
      formData.append('mobileNumber', this.phoneForm.get('phoneNumber')?.value);
      formData.append('otp', otp);
      formData.append('devicetype', 'app-anrdoid');
      this.http.post('ecom/login', formData).subscribe((response) => {
        this.userDetails = response.requestedData.userDetails;
        this.jwtToken = response.requestedData.JWT_Token;
        localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
        localStorage.setItem("JWT_Token", this.jwtToken);

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
}




// private generateOtpUrl = 'https://shopapi.alanaam.qa/api/ecom/generateotp';
// private verifyOtpUrl = 'https://shopapi.alanaam.qa/api/ecom/verifyotp'; // Adjust if necessary

// constructor(private http: HttpClient) {}
