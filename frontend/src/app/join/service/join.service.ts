import { Injectable } from '@angular/core';
import { CreateUserDto, LoginUserDto } from '../models';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';

export const JWT_NAME = 'local-token';

@Injectable({
  providedIn: 'root',
})
export class JoinService {

  isJoiningRoom$: Observable<string | undefined>;
  private isJoiningRoomSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.isJoiningRoom$ = this.isJoiningRoomSubject.asObservable();
  }

  isJoiningRoom(joining: string | undefined) {
    this.isJoiningRoomSubject.next(joining);
  }

  joinRoom(roomAddress: string | undefined) {
    return this.http.post('/api/rooms/join?roomAddress=' + roomAddress, {} );
  }

  getRoom(roomAddress: string) {
    return this.http.get<any>('/api/rooms/get?roomAddress=' + roomAddress);
  }

  getAdmin() {
    return this.http.get<any>('/api/users/admin');
  }

  register(user: CreateUserDto) {
    return this.http.post<any>('/api/auth/local/register', user);
  }

  login(loginUserDto: LoginUserDto) {
    return this.http.post<any>('/api/auth/local/login', loginUserDto).pipe(
      map((token) => {
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    );
  }
}
