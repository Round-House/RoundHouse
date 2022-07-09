import { Injectable } from '@angular/core';
import { CreateUserDto, LoginUserDto } from '../models';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs';

export const JWT_NAME = 'local-token';

@Injectable({
  providedIn: 'root'
})
export class JoinService {

  constructor(private http: HttpClient) { }

  register(user: CreateUserDto) {
    return this.http.post<any>('/api/auth/local/register', user);
  }

  login(loginUserDto: LoginUserDto) {  

    return this.http.post<any>('/api/auth/local/login', loginUserDto).pipe(
      map((token) => {
        console.log('token' + token.access_token);
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    )
  }

}
