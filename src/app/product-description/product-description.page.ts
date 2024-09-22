import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { BookingCartService } from '../services/booking-cart.service';

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

  constructor(
    private NavCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService, 
    private bookingCartService: BookingCartService
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

  onOrder(booking: string) {
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
      this.bookingCartService.addBooking(orderData);
      this.router.navigate(['logintype']);
    } else {
      //this.bookingCartService.addToCart(orderData);
      this.router.navigate(['logintype']);
    }
  }

  onBack() {
    this.NavCtrl.back();
  }
}
