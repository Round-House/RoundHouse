import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss'],
})
export class RightBarComponent implements OnInit {
  joinPage = false;

  constructor(private location: Location, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((url: any) => {
      console.log(url.url);
      if (url.url === '/join') {
        this.joinPage = true;
      } else if (url.url === undefined) {
      } else {
        this.joinPage = false;
      }
    });
  }
}
