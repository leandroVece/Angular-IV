import { Component, Input } from '@angular/core';
import { StoreService } from "../../../services/store.service";
import { Category } from '../../../models/product.model';
import { User } from 'src/app/models/user.models';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  public showMenu = false;
  counter = 0;
  @Input() categories: Category[] = [];
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    })
  }

  toggleSideBar(): void {
    this.showMenu = !this.showMenu;
  }

  login() {
    this.authService.login("john@mail.com", "changeme")
      .subscribe(data => {
        this.router.navigate(['/profile']);
      })
  }

  logout() {

  }
}
