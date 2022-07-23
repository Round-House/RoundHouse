import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMessageDto } from '../models/create-message.dto';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getRoomTree(address: string) {
    return this.http.get('/api/rooms/subRooms?roomAddress=' + address);
  }

  createMessage(address: string, message: CreateMessageDto) {
    return this.http
      .post<any>('/api/rooms/stream?roomAddress=' + address, message)
      .subscribe();
  }

  getMessages(address: string, page: number) {
    return this.http.get(
      '/api/rooms/stream?roomAddress=' + address + '&page=' + page
    );
  }
}
