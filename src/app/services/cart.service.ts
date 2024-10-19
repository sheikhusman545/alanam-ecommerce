import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  quantity: number;
  productAttributes: { [key: string]: any }; 
  product: any;
  totalPrice: number;
  cuttingAmount: '';
  productName: string,
  slaughterCharge: any;
  price: any;
  atributeID?: any;
  atributeItemID?: any;
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

   getCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Save cart to localStorage
   saveCartToStorage(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addProduct(product: CartItem) {
    const currentCart = this.cart.value;
    const index = currentCart.findIndex(
      (item) => item.productId === product.productId && this.matchproductAttributes(item.productAttributes, product.productAttributes)
    );
  
    if (index > -1) {
      currentCart[index].quantity += 1;
      currentCart[index].totalPrice = currentCart[index].price * currentCart[index].quantity + (currentCart[index].slaughterCharge * currentCart[index].quantity);
    } else {
      product.quantity = 1;
      product.totalPrice = product.price;  // Initialize totalPrice
      currentCart.push(product);
    }
  
    this.cart.next(currentCart);
    this.saveCartToStorage(currentCart);
    this.updateCartCount();
  }
  

  // Remove product or decrease quantity
  removeProduct(productId: number, productAttributes: { [key: string]: any }) {
    const currentCart = this.cart.value;
    const index = currentCart.findIndex(
      (item) => item.productId === productId && this.matchproductAttributes(item.productAttributes, productAttributes)
    );

    if (index > -1) {
      if (currentCart[index].quantity > 1) {
        currentCart[index].quantity -= 1;
        currentCart[index].totalPrice = currentCart[index].price * currentCart[index].quantity + (currentCart[index].slaughterCharge * currentCart[index].quantity);
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

  // Check if product productAttributes match
  private matchproductAttributes(attr1: { [key: string]: any }, attr2: { [key: string]: any }): boolean {
    return JSON.stringify(attr1) === JSON.stringify(attr2); // Simplified comparison of productAttributes
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
