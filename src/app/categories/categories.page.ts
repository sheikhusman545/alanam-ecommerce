import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

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
  public imagePath: 'https://shopapi.alanaam.qa/' | undefined;
  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAllProducts();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe((data: any) => {
      this.categories = data.requestedData.Categories; // Adjust based on your API response
      console.log(this.categories);
    });
  }
  loadAllProducts() {
    this.productsService.getAllProducts().subscribe((data: any) => {
      this.allProducts = data.requestedData.Products; // Adjust based on your API response
      console.log(this.allProducts);
      this.products = this.allProducts;
    });
  }

  loadProductsByCategory(categoryId: string) {
    this.productsService.getProductsByCategory(categoryId).subscribe((data: any) => {
      this.products = data.requestedData.Products; // Adjust based on your API response
    });
  }

  onCategoryClick(category: any) {
    if (category.categoryID === 'all') {
      this.products = this.allProducts;
    } else {
      this.loadProductsByCategory(category.categoryID);
    }
    this.selectedCategory = category;
  }

  onBack() {
    this.navCtrl.back();
  }

  onCart() {
    this.router.navigate(['cart']);
  }

  onRemove() {

  }

  onAdd() {

  }

  onOrder() {
    this.router.navigate(['checkout']);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product-description', productId]);
  }

}
