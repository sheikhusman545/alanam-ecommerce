import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/http.service';  // Assuming you have this service for HTTP calls
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  constructor(
    private httpClient: HttpClientService,
  ) { }

   ngOnInit() {
    let formData = new FormData();

    let products = [
      {
        productID: 39,
        productPrice: 650.00,
        SlaughterCharge: 30.00,
        packingCharge: undefined,
        productQuantity: 1,
        productAmount: 680,
        productAttributes: [
          {
            atributeID: "491",
            en_atributeName: "Cutting Type",
            ar_atributeName: "Cutting Type",
            items: {
              atributeItemID: "2898",
              en_itemName: "Full",
              ar_itemName: "Full",
              extraCost: "0.00"
            }
          }
        ]
      },
      {
        productID: 101,
        productPrice: 750.00,
        SlaughterCharge: 30.00,
        packingCharge: undefined,
        productQuantity: 3,
        productAmount: 2340,
        productAttributes: [
          {
            atributeID: "493",
            en_atributeName: "Cutting Type",
            ar_atributeName: "Cutting Type",
            items: {
              atributeItemID: "2909",
              en_itemName: "2 Pcs",
              ar_itemName: "2 Pcs",
              extraCost: "0.00"
            }
          }
        ]
      }
    ];
    // Append products to FormData
    products.forEach((product, index) => {
      formData.append(`products[${index}][productID]`, product.productID.toString());
      formData.append(`products[${index}][productPrice]`, product.productPrice.toString());
      formData.append(`products[${index}][SlaughterCharge]`, product.SlaughterCharge.toString());
      
      // Handle undefined packingCharge
      formData.append(`products[${index}][packingCharge]`, product.packingCharge ? product.packingCharge : '0');   
    
      formData.append(`products[${index}][productQuantity]`, product.productQuantity.toString());
      formData.append(`products[${index}][productAmount]`, product.productAmount.toString());
    
      // Stringify the productAttributes array and append as a single JSON string
      formData.append(`products[${index}][productAttributes]`, JSON.stringify(product.productAttributes));
    });
    
    // Append other data
    formData.append("totalProductsQuantity", "4");
    formData.append("totalProductPrice", "3020");
    formData.append("shippingCharge", "0");
    formData.append("shippingDiscount", "0");
    formData.append("couponDiscount", "0");
    formData.append("otherDiscount", "0");
    formData.append("grantTotal", "3020");
    formData.append("paymentType", "Online");
    formData.append("DeliveryMethod", "Self Pickup");
    formData.append("DeliveryDate", "05-10-2024 Sat");
    formData.append("DeliveryTime", "10AM-12PM");
    formData.append("paymentMethod", "card");
    formData.append("addressType", "Individual");
    formData.append("AddressTypeName", "333");
    formData.append("name", "ali");
    formData.append("buildingName_No", "333");
    formData.append("zoneNo", "333");
    formData.append("streetName_No", "33");
    formData.append("landMark", "33");
    formData.append("emailID", "SHEIKHUSMAN545@GMAIL.COM");
    formData.append("mobileNumber", "33272357");
    formData.append("city", "33");
    this.httpClient.post('ecom/cart', formData).subscribe(async response => {
      console.log('Order submitted successfully', response);
      let link = response.successMessages.redirectionURL;
      console.log('Redirecting to:', link);
       await Browser.open({ url: link });

    
    }, error => {
      console.error('Error submitting order', error);
    });
  }
}
  


