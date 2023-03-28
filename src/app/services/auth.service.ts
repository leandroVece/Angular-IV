import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './../models/auth.models';
import { User } from '../models/user.models';
import { Token } from '@angular/compiler';
import { tap, switchMap } from 'rxjs/operators';

import { environment } from './../../environments/environments';
import { TokenService } from './token.service';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //urlApi = `${environment.API_URL}/api/auth`
  urlApi = "https://damp-spire-59848.herokuapp.com/api/auth"
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor(private http: HttpClient,
    private TokenService: TokenService) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.urlApi}/login`, { email, password })
      .pipe(tap(response => this.TokenService.saveToken(response.access_token)))
      .pipe(switchMap(() => this.profile()))
  }

  profile() {
    return this.http.get<User>(`${this.urlApi}/profile`)
      .pipe(
        tap(user => this.user.next(user))
      )
  }

  logout() {
    this.TokenService.removeToken();
  }
}
