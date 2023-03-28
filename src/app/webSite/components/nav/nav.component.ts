import { Component, OnInit } from '@angular/core';
import { StoreService } from "../../../services/store.service";
import { Category } from '../../../models/product.model';
import { CategoriesService } from '../../../services/categories.service';
import { User } from 'src/app/models/user.models';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  counter = 0;
  token = '';
  profile: User | null = null;
  categories: Category[] = [];

  constructor(
    private storeService: StoreService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    })
    this.getAllCategories();
    this.authService.user$
      .subscribe(data => {
        this.profile = data;
      })
  }

  getAllCategories() {
    this.categoriesService.getAll()
      .subscribe(data => {
        this.categories = data;
      });
  }

  login() {
    this.authService.login("admin@mail.com", "admin123")
      .subscribe(() => {
        //this.profile = data;
        this.router.navigate(['/profile']);
      })
    console.log(this.profile)
  }

  logout() {
    this.authService.logout()
    this.profile = null;
    this.router.navigate(['/home']);
  }

}
