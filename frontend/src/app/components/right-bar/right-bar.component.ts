import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit {

  joinPage = false;

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.location.path() === '/join' ? this.joinPage = true : this.joinPage = false;
  }

}
