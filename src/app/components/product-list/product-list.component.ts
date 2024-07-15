import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currCategoryId: number = 1;
  previousCategoryId: number = 1;
  currCategoryName!: string;
  searchMode!: boolean;

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword!: string;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.productService
      .searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
      .subscribe(this.processResult());
  }

  handleListProducts() {
    // check if id param is available
    const categoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (categoryId) {
      this.currCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currCategoryName = this.route.snapshot.paramMap.get('name')!;
    }

    if (this.previousCategoryId != this.currCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currCategoryId;

    this.productService
      .getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currCategoryId
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }
}
