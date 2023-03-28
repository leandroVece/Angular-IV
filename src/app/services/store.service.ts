import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private myShoppingCart: Product[] = []
  private myCart = new BehaviorSubject<Product[]>([]);

  public myCart$ = this.myCart.asObservable();


  constructor() { }

  getShoppingCart() {
    return this.myShoppingCart
  }

  addProduct(product: Product) {
    this.myShoppingCart.push(product)
    this.myCart.next(this.myShoppingCart);
  }

  getTotal() {
    return this.myShoppingCart.reduce((sum, item) => sum + item.price, 0)
  }
}
