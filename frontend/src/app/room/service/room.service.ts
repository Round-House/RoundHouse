import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  getRoomTree(address: string) {
    return this.http.get('/api/rooms/subRooms?roomAddress=' + address);
  }
}
