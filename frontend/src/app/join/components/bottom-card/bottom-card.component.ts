import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AdminCardDto } from '../../models';
import { JoinService } from '../../service/join.service';

@Component({
  selector: 'app-bottom-card',
  templateUrl: './bottom-card.component.html',
  styleUrls: ['./bottom-card.component.scss'],
})
export class BottomCardComponent implements OnInit {
  username: string | undefined = '';
  nickname: string | undefined = '';
  image: string | undefined = '';

  constructor(private joinService: JoinService) {}

  ngOnInit(): void {
    this.joinService
      .getAdmin()
      .pipe(
        map((admin: AdminCardDto) => {
          if (admin) {
            this.nickname = admin.nickname;
            this.username = '@' + admin.username;
            this.image = admin.image;
          }
        })
      )
      .subscribe();
  }
}
