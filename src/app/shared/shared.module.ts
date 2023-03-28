import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ImgComponent } from './components/img/img.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';

@NgModule({
  declarations: [
    ImgComponent,
    ProductComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

  ],
  exports: [
    ImgComponent,
    ProductComponent,
    ProductsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
