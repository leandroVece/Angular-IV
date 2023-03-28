import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service'
import { Product } from './../../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  limit = 10;
  offset = 0;
  products: Product[] = [];
  productId: string | null = null

  constructor(private producServices: ProductsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.producServices.getProductsByPages(this.offset, this.limit)
      .subscribe(res => {
        this.products = res;
      });
    this.route.queryParamMap.subscribe(params => {
      this.productId = params.get('product')
    })
  }

  OnLoadMore() {
    this.producServices.getProductsByPages(this.offset, this.limit)
      .subscribe(res => {
        this.products = this.products.concat(res);
        console.log(this.products)
        this.offset += 10;
      });
  }

}
