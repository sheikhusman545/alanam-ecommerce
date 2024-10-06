import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  attributes: { [key: string]: any }; // Add attributes like size, color, etc.
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  cart$ = this.cart.asObservable();

  // Cart count subject
  private cartItemCount = new BehaviorSubject<number>(this.getCartItemCount());
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {}

  // Get cart from localStorage or return an empty array
  private getCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Save cart to localStorage
  private saveCartToStorage(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Add product to the cart with attributes
  addProduct(product: CartItem) {
    const currentCart = this.cart.value;
    const index = currentCart.findIndex(
      (item) => item.productId === product.productId && this.matchAttributes(item.attributes, product.attributes)
    );

    if (index > -1) {
      // If the product with the same attributes already exists, increase the quantity
      currentCart[index].quantity += 1;
    } else {
      // Add the new product with attributes and set quantity to 1
      product.quantity = 1;
      currentCart.push(product);
    }

    this.cart.next(currentCart);
    this.saveCartToStorage(currentCart); // Save updated cart to localStorage
    this.updateCartCount();
  }

  // Remove product or decrease quantity
  removeProduct(productId: number, attributes: { [key: string]: any }) {
    const currentCart = this.cart.value;
    const index = currentCart.findIndex(
      (item) => item.productId === productId && this.matchAttributes(item.attributes, attributes)
    );

    if (index > -1) {
      if (currentCart[index].quantity > 1) {
        currentCart[index].quantity -= 1;
      } else {
        currentCart.splice(index, 1); // Remove the product if quantity is 0
      }

      this.cart.next(currentCart);
      this.saveCartToStorage(currentCart); // Save updated cart to localStorage
      this.updateCartCount();
    }
  }

  // Clear cart
  clearCart() {
    this.cart.next([]);
    localStorage.removeItem('cart'); // Clear cart from localStorage
    this.cartItemCount.next(0); // Reset cart count
  }

  // Check if product attributes match
  private matchAttributes(attr1: { [key: string]: any }, attr2: { [key: string]: any }): boolean {
    return JSON.stringify(attr1) === JSON.stringify(attr2); // Simplified comparison of attributes
  }

  // Update cart count by summing up all item quantities
  private updateCartCount() {
    const currentCart = this.cart.value;
    const count = currentCart.reduce((total, item) => total + item.quantity, 0);
    this.cartItemCount.next(count); // Update cart count observable
  }

  // Get total number of items in the cart
  private getCartItemCount(): number {
    const cart = this.getCartFromStorage();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}
