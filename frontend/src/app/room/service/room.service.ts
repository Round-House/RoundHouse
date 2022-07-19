import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMessageDto } from '../components/models/create-message.dto';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getRoomTree(address: string) {
    return this.http.get('/api/rooms/subRooms?roomAddress=' + address);
  }

  createMessage(address: string, message: CreateMessageDto) {
    return this.http.post<any>(
      '/api/rooms/stream?roomAddress=' + address,
      message
    ).subscribe();
  }
}
