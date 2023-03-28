import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  productId: string | null = null;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private producServices: ProductsService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        return this.producServices.getAllProductById(this.productId)
          .subscribe(data => {
            console.log(data)
            this.product = data
          })
      }
      return [null]
    })

  }


  goToBack() {
    this.location.back();
  }
}
