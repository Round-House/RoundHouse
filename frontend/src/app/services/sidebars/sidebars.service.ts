import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarsService {
  constructor(private http: HttpClient) {}

  getUserTree() {
    return this.http.get('/api/rooms/rootRooms');
  }
}
