import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  token = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    const token = this.tokenService.getToken()
    if (token) {
      this.authService.profile().subscribe()
    }
  }
  /*createUser() {
    this.userService.create({
      name: 'Torres Castellano',
      email: 'Castellano@mail.com',
      password: '1212'
    })
      .subscribe(rta => {
        console.log(rta);
      });
  }*/
  /*
    login() {
      this.authService.login('Castellano@mail.com',
        '1212')
        .subscribe(rta => {
          console.log(rta.access_token)
          this.token = rta.access_token;
        })
    }
    getProfile() {
      this.authService.profile()
        .subscribe(
          profile => {
            console.log(profile)

          }
        );
    }*/


}
