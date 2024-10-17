import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import Swiper from 'swiper';
import { CartService } from '../services/cart.service';
import { LoadingController ,PopoverController} from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { LanguagePopoverComponent } from '../components/language-popover/language-popover.component';

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
  currentLanguage: string;


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
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private languageService: LanguageService
  ) {
    this.currentLanguage = this.languageService.getCurrentLanguage(); // Get the current language
  }

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
  switchLanguage(language: string) {
    this.currentLanguage = this.languageService.switchLanguage(language);
  }

  async openPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent, // Optional: or use ng-template inline in HTML
      event,
      translucent: true,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      this.currentLanguage = data; // Assign popover returned language to currentLanguage
    }
  }

}
