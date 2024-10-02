import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { BookingCartService } from '../services/booking-cart.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.page.html',
  styleUrls: ['./product-description.page.scss'],
})
export class ProductDescriptionPage implements OnInit {
  id: string | null = null;
  productData: any = null;
  attributes: any;
  quantity: number = 1; // Default quantity
  attribute_id: any = null;
  attrubite_item_id: any = null;
  is_user = this.authService.check();
  constructor(
    private NavCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private bookingCartService: BookingCartService,
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

  onAttributeChange(attribute: any, event: any) {
    console.log('Attribute change:', attribute.atributeID);
    console.log('Attribute event:', event);
    this.attribute_id = attribute.atributeID;
    this.attrubite_item_id = event;
  }

  onOrder(booking: string) {
    console.log(booking);
    if (booking === 'booking') {
      
      const totalPrice = this.quantity * this.productData.productPrice;
      const orderData = {
        product: this.productData,
        quantity: this.quantity,
        totalPrice: totalPrice,
        price: this.productData.productPrice,
        cuttingAmount: '',
        productName: this.productData.en_ProductName,
        slaughterCharge: this.productData.SlaughterCharge,
        atributeID: '',
        atributeItemID: ''
      };
      console.log('orderData', orderData);
      
      this.bookingCartService.addBooking(orderData);
      if (this.is_user) {
        this.router.navigate(['shipping-info']);
      } else {
        this.router.navigate(['logintype']);
      }
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
