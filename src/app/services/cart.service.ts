import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(cartItem: CartItem) {
    // Check if the item already exists in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      // Find the item in the cart based on item id
      // for (let item of this.cartItems) {
      //   if (item.id === cartItem.id) {
      //     existingCartItem = item;
      //     break;
      //   }
      // }

      //refactor from commented codes above
      existingCartItem = this.cartItems.find((item) => item.id === cartItem.id);
    }

    // Check if we found it
    alreadyExistsInCart = existingCartItem !== undefined;

    if (alreadyExistsInCart && existingCartItem) {
      // Increment the quantity
      existingCartItem.quantity++;
    } else {
      // Add the item to the array
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    //get index of item in array
    const itemIndex = this.cartItems.findIndex(
      (item) => item.id === cartItem.id
    );

    //if found, remove item from array at given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currCartItem of this.cartItems) {
      totalPriceValue += currCartItem.quantity * currCartItem.unitPrice;
      totalQuantityValue += currCartItem.quantity;
    }

    //publish the new values all subscribers will receive new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contents');
    for (let item of this.cartItems) {
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(
        `name:${item.name}, qty:${item.quantity}, unitprice: ${item.unitPrice}`
      );
      console.log(
        `totalPrice:${totalPriceValue.toFixed(
          2
        )}, totalQty:${totalQuantityValue}`
      );
    }
  }
}
