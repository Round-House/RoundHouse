import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

export const JWT_NAME = 'local-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }
}
