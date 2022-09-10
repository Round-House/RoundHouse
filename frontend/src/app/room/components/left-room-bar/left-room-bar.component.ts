import { NestedTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs';
import { RoomService } from '../../services/room/room.service';
import { RoomDto } from '../../models/room.dto';
import { Title } from '@angular/platform-browser';
import { ComponentData } from 'src/app/services/plugins/componentData.interface';
import { PluginsService } from 'src/app/services/plugins/plugins.service';

@Component({
  selector: 'app-left-room-bar',
  templateUrl: './left-room-bar.component.html',
  styleUrls: ['./left-room-bar.component.scss'],
})
export class LeftRoomBarComponent implements OnInit, AfterViewInit {
  /* Plugin Block Setup Start */
  pluginData: ComponentData[];

  @ViewChild('dynamic', {
    read: ViewContainerRef,
  })
  viewContainerRef!: ViewContainerRef;

  componentLocation: string[] = ['app', 'room', 'leftRoomBar'];
  /* Plugin Block Setup End */

  treeControl = new NestedTreeControl<RoomDto>((node) => node.childRooms);
  dataSource = new MatTreeNestedDataSource<RoomDto>();

  roomTree: RoomDto[] | undefined;

  rootRoomAddress: string | undefined;

  rootRoomName: string | undefined;

  currentRoom: string | undefined;

  param: string | null = this.route.snapshot.queryParamMap.get('hub');

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router,
    private titleService: Title,
    private pluginsService: PluginsService
  ) {
    this.pluginData = [];
  }

  ngOnInit(): void {
    this.roomService
      .getRoomTree(this.route.snapshot.queryParams['hub'])
      .pipe(
        map((rooms: RoomDto) => {
          this.rootRoomName = rooms.name;
          this.rootRoomAddress = rooms.roomAddress;
          this.currentRoom = rooms.roomAddress;
          if (rooms.childRooms) {
            this.roomTree = rooms.childRooms;
            this.dataSource.data = this.roomTree;
          }
          this.titleService.setTitle(rooms.name!!);
        })
      )
      .subscribe();
    this.route.queryParams.subscribe((params) => {
      if (this.param != params['hub']) {
        this.param = params['hub'];
        this.ngOnInit();
      }
    });
  }

  ngAfterViewInit(): void {
    this.generatePlugins();
  }

  changeRoom(address: string) {
    this.currentRoom = address;
    const queryParams: Params = { address: address };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  roomSelected(address: string) {
    return address === this.currentRoom;
  }

  hasChild = (_: number, node: RoomDto) =>
    !!node.childRooms && node.childRooms.length > 0;

  generatePlugins() {
    this.pluginData = [
      { name: 'treeControl', data: this.treeControl },
      { name: 'dataSource', data: this.dataSource },
      { name: 'roomTree', data: this.roomTree },
      { name: 'rootRoomAddress', data: this.rootRoomAddress },
      { name: 'rootRoomName', data: this.rootRoomName },
      { name: 'currentRoom', data: this.currentRoom },
      { name: 'param', data: this.param },
    ];
    this.pluginsService.getPlugins(
      this.viewContainerRef,
      this.componentLocation,
      this.pluginData
    );
  }
}
