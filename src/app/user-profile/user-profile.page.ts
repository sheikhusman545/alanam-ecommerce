import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientService } from '../services/http.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {


  userForm!: FormGroup;
  private token :any = localStorage.getItem('JWT_Token');  // Retrieve token from localStorage
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClientService

  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    this.authService.getUserDetails$().subscribe((userDetails) => {
      console.log(userDetails);
      if (userDetails) {
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
        'Authorization': `Bearer ${this.token}`,   // Authorization header
        'X-Auth-Token': this.token || ''           // X-Auth-Token header
      });
  
      return this.http.post('ecom/myaccount/updateprofile', formData, { headers }).subscribe((response) => {
        console.log(response);
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
