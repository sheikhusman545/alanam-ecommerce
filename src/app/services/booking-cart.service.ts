import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingCartService {
  // BehaviorSubject to hold the state of the booking cart
  private bookingCartSubject = new BehaviorSubject<any[]>([]);
  bookingCart$ = this.bookingCartSubject.asObservable();  // Observable to expose the data

  constructor() {}

  // Add a booking and emit the updated cart
  addBooking(booking: any) {
    const currentCart = this.bookingCartSubject.getValue();
    this.bookingCartSubject.next([...currentCart, booking]);
  }

  // Remove a booking and emit the updated cart
  removeBooking(index: number) {
    const currentCart = this.bookingCartSubject.getValue();
    currentCart.splice(index, 1);
    this.bookingCartSubject.next([...currentCart]);  // Emit updated cart
  }

  // Clear the cart and emit an empty array
  clearCart() {
    this.bookingCartSubject.next([]);
  }
}
