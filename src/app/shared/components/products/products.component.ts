import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Product, CreateProduct, UpdateProduct } from '../../../models/product.model';
import { StoreService } from '../../../services/store.service'
import { ProductsService } from '../../../services/products.service'
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  //Carrito
  myShoppingCart: Product[] = []

  //ListadeProductos
  @Input() products: Product[] = [];
  @Output() loadMore = new EventEmitter();
  producChosen: Product | null = null;
  @Input() set productId(id: string | null) {
    if (id) {
      this.OnShowDetail(id)
    }
  }
  total = 0;
  showProduct = false;


  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  ngAfterViewInit(): void {
    register();
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  constructor(
    private storeService: StoreService,
    private producServices: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart()
  }

  toggleProduct() {
    this.showProduct = !this.showProduct
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product)
    this.total = this.storeService.getTotal();
  }

  OnShowDetail(id: string) {

    if (!this.showProduct) {
      this.showProduct = true
    }
    this.producServices.getAllProductById(id).subscribe(
      data => {
        //this.toggleProduct();
        this.producChosen = data
      }, error => {
        console.log(error);
      })
  }

  createProduct(): void {
    const body: CreateProduct = {
      title: 'El producto!',
      description: 'El producto mas chingon',
      images: ['https://example.com/image'],
      price: 100,
      categoryId: 4
    };
    this.producServices.create(body)
      .subscribe(data => {
        //console.log(data)
        this.products.push(data);
      });
  }

  UpdateProduct(): void {
    const changes: UpdateProduct = {
      title: 'El señor titulo'
    }
    const id = this.producChosen?.id || ''
    this.producServices.update(id, changes).subscribe(
      data => {
        const p = this.products.findIndex(item => item.id === this.producChosen?.id)
        this.products[p] = data
      })
  }

  DeleteProduct(): void {
    const id = this.producChosen?.id || ''
    this.producServices.Delete(id)
      .subscribe(p => {
        const index = this.products.findIndex(item => item.id === this.producChosen?.id)
        this.products.splice(index, 1)
        this.showProduct = false;
      })
  }

  OnLoadMore() {
    this.loadMore.emit()
  }

}
