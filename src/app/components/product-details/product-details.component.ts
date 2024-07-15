import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService
      .getProduct(productId)
      .subscribe((data) => (this.product = data));
  }

  addToCart() {
    console.log('adding to cart in detail page');
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
