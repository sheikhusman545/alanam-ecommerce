import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-homepage-2',
  templateUrl: './homepage-2.page.html',
  styleUrls: ['./homepage-2.page.scss'],
})
export class Homepage2Page implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  featuredProducts: any[] = [];
  newProduct: any[] = [];
  categories: any[] = [];
  
  isLoading = false;

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService

  ) { }

  ngOnInit() {
    this.showLoader();
    this.getFeaturedProducts();
    this.getNewProducts();
    this.getCategories();
    this.hideLoader();
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
  onCategoryClick(category: any) {
    console.log('Category clicked', category);
    this.router.navigate(['/search-product', category.categoryID ]);
  }

  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }

  navigateToCategory(CategoryId: any) {
    this.router.navigate(['/tabs/categories']);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product-description', productId]);
  }
}
