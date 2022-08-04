import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getRoomTree(address: string) {
    return this.http.get('/api/rooms/subRooms?roomAddress=' + address);
  }

  createMessage(address: string, message: string) {
    return this.http
      .post<any>('/api/rooms/stream?roomAddress=' + address, message)
      .subscribe();
  }

  getMessages(address: string, prevTimestamp: number) {
    return this.http
      .get(
        '/api/rooms/stream?roomAddress=' + address + '&prev=' + prevTimestamp
      )
      .pipe(map((response) => response));
  }
}
