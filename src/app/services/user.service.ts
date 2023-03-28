import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, CreateUser } from '../models/user.models';

import { environment } from './../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  //urlApi = `${environment.API_URL}/api/users`
  urlApi = "https://damp-spire-59848.herokuapp.com/api/users";

  constructor(private http: HttpClient) { }

  create(user: CreateUser) {
    console.log(this.urlApi)
    return this.http.post<User>(this.urlApi, user)
  }

  getAll() {
    return this.http.get<User[]>(this.urlApi)
  }

}
