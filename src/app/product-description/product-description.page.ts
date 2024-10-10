import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { BookingCartService } from '../services/booking-cart.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.page.html',
  styleUrls: ['./product-description.page.scss'],
})
export class ProductDescriptionPage implements OnInit {
  id: string | null = null;
  productData: any = null;
  quantity: number = 1; // Default quantity
  attribute_id: any = null;
  attrubite_item_id: any = null;
  attributes: any[] = [];
  productAttributes: any[] = [];
  attr_id: any;

  constructor(
    private NavCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private bookingCartService: BookingCartService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getProductDetails(this.id);
      }
    });
  }

  getProductDetails(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (response) => {
        this.productData = response.requestedData.Product[0];
        this.attributes = response.requestedData.Attributes;
        console.log('Attributes:', this.attributes);
        this.quantity = this.productData.minQuantity;
        console.log('Product details:', this.productData);
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  onAdd() {
    this.quantity++;

  }

  onRemove() {
    if (this.quantity > this.productData.minQuantity) {
      this.quantity--;
    }
  }

  // onAttributeChange(attribute: any, event: any) {
  //   const selectedItem = event.detail.value; // This contains the selected item data
  //   console.log('Attribute:', attribute);
  //   console.log('Selected Item:', selectedItem);
  // }

  isAuthenticated() {
    this.authService.check().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['shipping-info']);
      } else {
        this.router.navigate(['logintype']);
      }
    });
  }

  onAttributeChange(attribute: any, event: any) {
    console.log('Event:', event.detail.value.atributeItemID);
    this.attrubite_item_id = event.detail.value.atributeItemID;
    this.attr_id = attribute.atributeID;
    console.log('Attribute:', attribute);
    const selectedItem = event.detail.value; 
    console.log('Attribute:', attribute);
    const existingAttribute = this.productAttributes.find(
      (attr) => attr.atributeID === attribute.atributeID
    );
    const newAttribute = {
      atributeID: attribute.atributeID,
      en_atributeName: attribute.en_atributeName,
      ar_atributeName: attribute.ar_atributeName,
      items: selectedItem 
    };

    if (existingAttribute) {
      const index = this.productAttributes.indexOf(existingAttribute);
      this.productAttributes[index] = newAttribute;
    } else {
      this.productAttributes.push(newAttribute);
    }

    console.log('productAttributes:', this.productAttributes);
  }


  onOrder(booking: string) {
    console.log(booking);
    if (booking === 'booking') {

      const totalPrice = this.quantity * this.productData.productPrice;
      const orderData = {
        product: this.productData,
        quantity: this.quantity,
        orderTotal: totalPrice,
        payableAmount: totalPrice,
        price: this.productData.productPrice,
        cuttingAmount: '',
        productName: this.productData.en_ProductName,
        slaughterCharge: this.productData.SlaughterCharge,
        atributeID: this.attr_id || '',
        atributeItemID: this.attrubite_item_id || '',
      };
      console.log('orderData', orderData);

      this.bookingCartService.addBooking(orderData);
      this.isAuthenticated();
    } else {
      const totalPrice = this.quantity * this.productData.productPrice;
      const orderDataCart = {
        prodductId: this.productData.productID,
        product: this.productData,
        quantity: this.quantity,
        totalPrice: totalPrice,
        price: this.productData.productPrice,
        cuttingAmount: '',
        productName: this.productData.en_ProductName,
        slaughterCharge: this.productData.SlaughterCharge,
        productAttributes: this.productAttributes
      };
      this.cartService.addProduct( {
        product: this.productData,
        quantity: this.quantity,
        totalPrice: totalPrice,
        price: this.productData.productPrice,
        cuttingAmount: '',
        productName: this.productData.en_ProductName,
        slaughterCharge: this.productData.SlaughterCharge,
        productAttributes: this.productAttributes,
        productId: this.productData.productID
      });
      ;


    }
  }
  /*
  productID: 132
atributeID: 
atributeItemID: 
quantity: 5
customerName: ali
slaughterCharge: 0.00
cuttingAmount: 0
deliveryMethod: Doorstep Delivery
shippingCharge: 20
orderTotal: 220.00
payableAmount: 200
addressType: Individual
AddressTypeName: 
name: ali
buildingName_No: 
zoneNo: 
streetName_No: 
landMark: 
emailID: SHEIKHUSMAN545@GMAIL.COM
phoneNo: 33272357
city: 
deliveryTime: 10AM-12PM
paymentType: Self Payment
  */

  onBack() {
    this.NavCtrl.back();
  }
}
