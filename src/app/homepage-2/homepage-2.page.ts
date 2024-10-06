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
}
