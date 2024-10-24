import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import { HttpClient } from '@angular/common/http';
import { NavController, LoadingController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import Swiper from 'swiper';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  selectedCategory: any = null;
  allProducts: any[] = [];
  subCategory: any;
  cartCount: number = 0;
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentLanguage: string | 'en' | undefined;

  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private router: Router,
    private navCtrl: NavController,
    private cartService: CartService,
    private loadingController: LoadingController,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.cartService.cartItemCount$.subscribe((count) => (this.cartCount = count));
    this.loadCategories();
    this.loadAllProducts();
  }

  async loadCategories() {
    const loader = await this.loadingController.create({
      message: 'Loading categories...',
    });
    await loader.present(); 

    this.categoriesService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data.requestedData.Categories; 
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
      complete: () => {
        loader.dismiss(); 
      },
    });
  }

  async loadAllProducts() {
    const loader = await this.loadingController.create({
      message: 'Loading products...',
    });
    await loader.present(); 

    this.productsService.getAllProducts().subscribe({
      next: (data: any) => {
        this.allProducts = data.requestedData.Products; 
        this.products = this.allProducts;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
      complete: () => {
        loader.dismiss(); 
      },
    });
  }

  async loadProductsByCategory(categoryId: string) {
    const loader = await this.loadingController.create({
      message: 'Loading products for category...',
    });
    await loader.present(); 
    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: (data: any) => {
        this.products = data.requestedData.Products; 
      },
      error: (error) => {
        console.error('Error loading products by category:', error);
      },
      complete: () => {
        loader.dismiss(); 
      },
    });
  }

  getSubCategories(categoryId: string) {
    this.categoriesService.getSubCategories(categoryId).subscribe((data: any) => {
      this.subCategory = data.requestedData.Categories;
    });
  }

  onCategoryClick(category: any) {
    if (category.categoryID !== undefined) {
      this.loadProductsByCategory(category.categoryID);
      this.getSubCategories(category.categoryID);
    } else {
      this.loadAllProducts();
      this.subCategory = null;
    }
    this.selectedCategory = category;
  }

  onBack() {
    this.navCtrl.back();
  }

  navigateToCart() {
    console.log('Navigating to cart');  
    this.router.navigate(['/tabs/cart']);
  }
  
  onOrder() {
    this.router.navigate(['checkout']);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product-description', productId]);
  }
}
