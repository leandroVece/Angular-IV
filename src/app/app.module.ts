import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './webSite/components/nav/nav.component';
import { SideMenuComponent } from './webSite/components/side-menu/side-menu.component';
import { TimeInterceptor } from './interceptors/time.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HomeComponent } from './webSite/pages/home/home.component';
import { NotFoundComponent } from './webSite/pages/not-found/not-found.component';
import { CategoryComponent } from './webSite/pages/category/category.component';
import { MycartComponent } from './webSite/pages/mycart/mycart.component';
import { LoginComponent } from './webSite/pages/login/login.component';
import { RegisterComponent } from './webSite/pages/register/register.component';
import { RecoveryComponent } from './webSite/pages/recovery/recovery.component';
import { ProfileComponent } from './webSite/pages/profile/profile.component';
import { ProductDetailComponent } from './webSite/pages/product-detail/product-detail.component';
import { LayoutComponent } from './webSite/components/layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SideMenuComponent,
    HomeComponent,
    NotFoundComponent,
    CategoryComponent,
    MycartComponent,
    LoginComponent,
    RegisterComponent,
    RecoveryComponent,
    ProfileComponent,
    ProductDetailComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TimeInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
