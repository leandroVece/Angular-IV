import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { CustomPreloadService } from './services/custom-preload.service';

import { CategoryComponent } from './webSite/pages/category/category.component';
import { HomeComponent } from './webSite/pages/home/home.component';
import { LoginComponent } from './webSite/pages/login/login.component';
import { MycartComponent } from './webSite/pages/mycart/mycart.component';
import { ProfileComponent } from './webSite/pages/profile/profile.component';
import { RecoveryComponent } from './webSite/pages/recovery/recovery.component';
import { RegisterComponent } from './webSite/pages/register/register.component';
import { NotFoundComponent } from './webSite/pages/not-found/not-found.component';
import { ProductDetailComponent } from './webSite/pages/product-detail/product-detail.component';
import { LayoutComponent } from './webSite/components/layout/layout.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'category/:id',
        component: CategoryComponent
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      },
      {
        path: 'mycart',
        component: MycartComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ProfileComponent
      },
      {
        path: 'recobery',
        component: RecoveryComponent
      }]
  },
  {
    path: 'cms',
    canActivate: [AdminGuard],
    loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule),
    data: {
      preload: true
    }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    //preloadingStrategy: PreloadAllModules
    preloadingStrategy: CustomPreloadService
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
