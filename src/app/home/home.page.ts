import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import Swiper from 'swiper';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  
  featuredProducts: any[] = [];
  newProduct: any[] = [];
  categories: any[] = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 2000,  // 2 seconds delay between slides
      disableOnInteraction: false,  // Keep autoplay running even when the user interacts with the slider
    },
    loop: true, // Enable infinite scrolling
  };
  
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
 

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService

  ) { }

  ngOnInit() {
    this.getFeaturedProducts();
    this.getNewProducts();
    this.getCategories();
  }

  navigateToCategory(CategoryId: any) {
    this.router.navigate(['/category', {CategoryId }]);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product-description', productId]);
  }

  addToCart(product: any) {
    console.log('Added to cart: ', product.title);
  }
  getFeaturedProducts() {
    this.productsService.getFeaturedProducts().subscribe((data) => {
      this.featuredProducts = data.requestedData.Products;
      console.log('Featured Products: ', data);
    });
  }
  getNewProducts() {
    this.productsService.getNewProducts().subscribe((data) => {
      this.newProduct = data.requestedData.Products;
      console.log('New Products: ', data);
    });
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe((data) => {
      console.log('Categories: ', data);
      this.categories = data.requestedData.Categories;
    });
  }
  goPrevSlide() {
    this.swiper?.slidePrev();
  }
  goNextSlide() {
    this.swiper?.slideNext()
  }
  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  goNext() {
  }

  goPrev() {
  }
}
