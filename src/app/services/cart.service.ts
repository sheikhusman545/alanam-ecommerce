import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';

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
  is_eid?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  cart$ = this.cart.asObservable();

  private cartItemCount = new BehaviorSubject<number>(this.getCartItemCount());
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private toastController: ToastController) { }


  getCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Save cart to localStorage
  saveCartToStorage(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // addProduct(product: CartItem) {
  //   console.log('Adding product to cart:', product);
  //   const currentCart = this.cart.value;
  //   if (product.is_eid) {
  //     console.log('EID product detected. Clearing previous cart.');
  //     this.clearCart();
  //   }
  //   const index = currentCart.findIndex(
  //     (item) => item.productId === product.productId && this.matchproductAttributes(item.productAttributes, product.productAttributes)
  //   );

  //   if (index > -1) {
  //     currentCart[index].quantity += 1;
  //     currentCart[index].totalPrice = currentCart[index].price * currentCart[index].quantity + (currentCart[index].slaughterCharge * currentCart[index].quantity);
  //   } else {
  //     product.quantity = 1;
  //     product.totalPrice = Number(product.price) + Number(product.slaughterCharge);  // Initialize totalPrice
  //     currentCart.push(product);
  //   }

  //   this.cart.next(currentCart);
  //   this.saveCartToStorage(currentCart);
  //   this.updateCartCount();
  // }


  // Remove product or decrease quantity

  // addProduct(product: CartItem) {
  //   console.log('Adding product to cart:', product);

  //   let currentCart = this.cart.value;
  //   const isIncomingEid = !!product.is_eid;
  //   const existingIndex = currentCart.findIndex(
  //     (item) =>
  //       item.productId === product.productId &&
  //       this.matchproductAttributes(item.productAttributes, product.productAttributes)
  //   );

  //   const cartHasEid = currentCart.some(item => item.is_eid);

  //   // 🛑 If product is EID and cart has a different product, clear cart
  //   if (isIncomingEid) {
  //     if (existingIndex === -1 || !cartHasEid) {
  //       console.log('Incoming product is EID. Cart does not match — clearing cart.');
  //       currentCart = [];
  //     }
  //   }

  //   // 🛑 If cart has an EID item, only allow same product
  //   if (cartHasEid && !isIncomingEid) {
  //     console.warn('Cart has an EID item. Non-EID products are blocked.');
  //     return;
  //   }

  //   if (cartHasEid && isIncomingEid && existingIndex === -1) {
  //     console.warn('Cart has an EID item. Different EID product is blocked.');
  //     return;
  //   }

  //   // ✅ Safe to add or increment product
  //   if (existingIndex > -1) {
  //     currentCart[existingIndex].quantity += 1;
  //     currentCart[existingIndex].totalPrice =
  //       currentCart[existingIndex].price * currentCart[existingIndex].quantity +
  //       (currentCart[existingIndex].slaughterCharge * currentCart[existingIndex].quantity);
  //   } else {
  //     product.quantity = 1;
  //     product.totalPrice = Number(product.price) + Number(product.slaughterCharge);
  //     currentCart.push(product);
  //   }

  //   this.cart.next(currentCart);
  //   this.saveCartToStorage(currentCart);
  //   this.updateCartCount();
  // }

  addProduct(product: CartItem) {
    console.log('Adding product to cart:', product);

    let currentCart = this.cart.value;
    const isIncomingEid = !!product.is_eid;

    const existingIndex = currentCart.findIndex(
      (item) =>
        item.productId === product.productId &&
        this.matchproductAttributes(item.productAttributes, product.productAttributes)
    );

    const cartHasEid = currentCart.some(item => item.is_eid);

    // 🧹 If incoming product is EID, remove all non-EID items
    if (isIncomingEid) {
      currentCart = currentCart.filter(item => item.is_eid);
    }

    // 🚫 If cart has any EID product, block non-EID additions
    if (!isIncomingEid && cartHasEid) {
      console.warn('Cart has EID items. Non-EID product blocked.');
      return;
    }

    // ✅ Add or update the product
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
      currentCart[existingIndex].totalPrice =
        currentCart[existingIndex].price * currentCart[existingIndex].quantity +
        (currentCart[existingIndex].slaughterCharge * currentCart[existingIndex].quantity);
    } else {
      product.quantity = 1;
      product.totalPrice = Number(product.price) + Number(product.slaughterCharge);
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

  private matchproductAttributes(attr1: { [key: string]: any }, attr2: { [key: string]: any }): boolean {
    return JSON.stringify(attr1) === JSON.stringify(attr2); // Simplified comparison of productAttributes
  }

  private updateCartCount() {
    const currentCart = this.cart.value;
    const count = currentCart.reduce((total, item) => total + item.quantity, 0);
    this.cartItemCount.next(count); // Update cart count observable
  }

  // CartService
  updatePrices(prices: any[]) {
    let currentCart = this.cart.value;
    console.log("Updating cart prices with:", prices);
    let updated = false;
    let removedItems: string[] = [];

    // Filter out items with status = "2" (disabled)
    currentCart = currentCart.filter(item => {
      const priceInfo = prices.find(p => String(p.productID) === String(item.productId));
      
      // If product not found or status is "2", remove it
      if (!priceInfo || String(priceInfo.status) == "2") {
        removedItems.push(item.productName);
        updated = true;
        return false; // Remove this item
      }
      
      return true; // Keep this item
    });

    // Update prices for remaining items
    currentCart = currentCart.map(item => {
      const priceInfo = prices.find(p => String(p.productID) === String(item.productId));
      if (priceInfo) {
        const newPrice = Number(priceInfo.productPrice);
        const newSlaughter = Number(priceInfo.SlaughterCharge || 0);

        // Only update if changed
        if (item.price !== newPrice || item.slaughterCharge !== newSlaughter) {
          item.price = newPrice;
          item.slaughterCharge = newSlaughter;

          item.totalPrice =
            (item.price * item.quantity) +
            (item.slaughterCharge * item.quantity) +
            (Number(item.cuttingAmount) * item.quantity || 0);

          updated = true;
        }
      }
      return item;
    });

    if (updated) {
      this.cart.next(currentCart);
      this.saveCartToStorage(currentCart);
      this.updateCartCount();

      // Show appropriate message based on what was updated
      if (removedItems.length > 0) {
        const message = removedItems.length === 1
          ? `"${removedItems[0]}" has been removed (no longer available)`
          : `${removedItems.length} items have been removed (no longer available)`;
        this.showToast(message);
      } else {
        this.showToast("Cart prices have been updated");
      }

      console.log("Cart updated with new prices");
      if (removedItems.length > 0) {
        console.log("Removed disabled items:", removedItems);
      }
    } else {
      console.log("Prices unchanged — cart left as is");
    }
  }


  private getCartItemCount(): number {
    const cart = this.getCartFromStorage();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000, // 2 seconds
      position: 'bottom',
      color: 'success' // you can use "primary" | "danger" | "warning" etc.
    });
    await toast.present();
  }

}
