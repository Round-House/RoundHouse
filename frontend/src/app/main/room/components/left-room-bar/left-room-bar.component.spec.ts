import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftRoomBarComponent } from './left-room-bar.component';

describe('LeftRoomBarComponent', () => {
  let component: LeftRoomBarComponent;
  let fixture: ComponentFixture<LeftRoomBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftRoomBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftRoomBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
