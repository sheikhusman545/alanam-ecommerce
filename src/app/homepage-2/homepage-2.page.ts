import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import Swiper from 'swiper';
import { CartService } from '../services/cart.service';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-homepage-2',
  templateUrl: './homepage-2.page.html',
  styleUrls: ['./homepage-2.page.scss'],
})
export class Homepage2Page implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  featuredProducts: any[] = [];
  newProduct: any[] = [];
  categories: any[] = [];
  cartCount = 0;

  swiperConfig = {
    autoplay: { delay: 3000, disableOnInteraction: false },
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: { clickable: true },
    slidesPerView: 1,
    slidesPerGroup: 1,
  };

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.cartService.cartItemCount$.subscribe((count) => (this.cartCount = count));
    await this.loadDataWithLoader();
  }

  async loadDataWithLoader() {
    const loader = await this.loadingController.create({
      message: 'Alanam Loading...',
      spinner: 'crescent',
    });
    await loader.present();

    forkJoin({
      featured: this.productsService.getFeaturedProducts(),
      newProducts: this.productsService.getNewProducts(),
      categories: this.categoriesService.getCategories()
    }).subscribe({
      next: (results) => {
        this.featuredProducts = results.featured.requestedData.Products;
        this.newProduct = results.newProducts.requestedData.Products;
        this.categories = results.categories.requestedData.Categories;
      },
      error: (error) => {
        console.error('Error loading data:', error);
      },
      complete: () => {
        loader.dismiss();
      }
    });
  }

  onCategoryClick(category: any) {
    this.router.navigate(['/search-product', category.categoryID]);
  }

  navigateToCategory(CategoryId: any) {
    this.router.navigate(['/tabs/categories']);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product-description', productId]);
  }
  goToCart() {
    this.router.navigate(['/tabs/cart']);
  }
}

// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Router } from '@angular/router';
// import { ProductsService } from '../services/products.service';
// import { CategoriesService } from '../services/categories.service';
// import Swiper from 'swiper';
// import { CartService } from '../services/cart.service';
// import { LoadingController } from '@ionic/angular';

// @Component({
//   selector: 'app-homepage-2',
//   templateUrl: './homepage-2.page.html',
//   styleUrls: ['./homepage-2.page.scss'],
// })
// export class Homepage2Page implements OnInit {
//   @ViewChild('swiper')
//   swiperRef: ElementRef | undefined;
//   swiper?: Swiper;
//   featuredProducts: any[] = [];
//   newProduct: any[] = [];
//   categories: any[] = [];
//   isLoading = false;
//   cartCount = 0;
  
//   swiperConfig = {
//     autoplay: {
//       delay: 3000,
//       disableOnInteraction: false,
//     },
//     loop: true,
//     loopFillGroupWithBlank: true,
//     pagination: { clickable: true },
//     slidesPerView: 1,
//     slidesPerGroup: 1,
//   };

//   constructor(
//     private router: Router,
//     private productsService: ProductsService,
//     private categoriesService: CategoriesService,
//     private cartService: CartService

//   ) { }

//   ngOnInit() {
//     this.cartService.cartItemCount$.subscribe(count => {
//       this.cartCount = count;
//     });
//     this.getFeaturedProducts();
//     this.getNewProducts();
//     this.getCategories();
//     this.hideLoader();
//   }

//   getFeaturedProducts() {
//     this.productsService.getFeaturedProducts().subscribe((data) => {
//       this.featuredProducts = data.requestedData.Products;
//       console.log('Featured Products: ', data);
//     });
//   }
//   getNewProducts() {
//     this.productsService.getNewProducts().subscribe((data) => {
//       this.newProduct = data.requestedData.Products;
//       console.log('New Products: ', data);
//     });
//   }

//   getCategories() {
//     this.categoriesService.getCategories().subscribe((data) => {
//       console.log('Categories: ', data);
//       this.categories = data.requestedData.Categories;
//     });
//   }
//   onCategoryClick(category: any) {
//     console.log('Category clicked', category);
//     this.router.navigate(['/search-product', category.categoryID ]);
//   }

//   showLoader() {
//     this.isLoading = true;
//   }

//   hideLoader() {
//     this.isLoading = false;
//   }

//   navigateToCategory(CategoryId: any) {
//     this.router.navigate(['/tabs/categories']);
//   }

//   navigateToProduct(productId: string) {
//     this.router.navigate(['/product-description', productId]);
//   }
//   goToCart() {
//     this.router.navigate(['/tabs/cart']);
//   }
// }
