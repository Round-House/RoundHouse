import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent implements OnInit {

  joinPage = false;

  constructor(private location: Location) { }

  ngOnInit(): void {
    console.log(this.location.path());
    this.location.path() === '/join' ? this.joinPage = true : this.joinPage = false;
  }

}
