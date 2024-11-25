import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular'; // Import LoadingController
import { ProductsService } from '../services/products.service';
import { BookingCartService } from '../services/booking-cart.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { LanguageService } from '../services/language.service';
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
  loading: any;
  currentLanguage: string = 'en';
  attribute_msg = '';
  selectedValue: boolean = false;



  constructor(
    private NavCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private bookingCartService: BookingCartService,
    private cartService: CartService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private languageService: LanguageService

  ) { }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getProductDetails(this.id);
      }
    });
  }

  async getProductDetails(productId: string) {
    this.loading = await this.loadingController.create({
      message: 'Loading product details...', // Optional message
      spinner: 'crescent' // You can choose different spinner styles
    });
    await this.loading.present(); // Present the loader

    this.productService.getProductById(productId).subscribe(
      (response) => {
        this.productData = response.requestedData.Product[0];
        this.attributes = response.requestedData.Attributes;
        this.quantity = this.productData.minQuantity;
        this.loading.dismiss();
      },
      (error) => {
        console.error('Error fetching product details:', error);
        this.loading.dismiss();
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

  isAuthenticated() {
    this.authService.check().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['shipping-info']);
      } else {
        this.router.navigate(['logintype']);
      }
    });
  }

  isAllAttributesSelected(): boolean {
    return this.attributes.length > 0;
  }


  onAttributeChange(attribute: any, event: any) {
    if (event.detail.value !== null) {
      this.selectedValue = true;
    }
    this.attrubite_item_id = event.detail.value.atributeItemID;
    this.attr_id = attribute.atributeID;
    const selectedItem = event.detail.value;
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

  }

  onOrder(booking: string) {
    if (this.isAllAttributesSelected()) {
      if (this.selectedValue === false) {
        this.attribute_msg = "Please select cutting type";
        return
      }
      else {
        this.attribute_msg = '';
      }
    }
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

      this.bookingCartService.addBooking(orderData);
      this.isAuthenticated();
    } else {
      for (let i = 0; i < this.quantity; i++) {
        this.addItemToCart();
      }

      this.router.navigate(['/tabs/cart']);
    }
  }

  addItemToCart() {
    console.log(this.productAttributes);
    const totalPrice = this.productData.productPrice;
    this.cartService.addProduct({
      product: this.productData,
      quantity: this.quantity,
      totalPrice: totalPrice + this.productData.SlaughterCharge,
      price: this.productData.productPrice,
      cuttingAmount: '',
      productName: this.productData.en_ProductName,
      slaughterCharge: this.productData.SlaughterCharge,
      productAttributes: this.productAttributes,
      productId: this.productData.productID,
      atributeID: this.attr_id || '',
      atributeItemID: this.attrubite_item_id || '',
    });
  }

  onBack() {
    this.NavCtrl.back();
  }
}
