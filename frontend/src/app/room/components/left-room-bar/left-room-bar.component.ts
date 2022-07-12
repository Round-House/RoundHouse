import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';

 interface RoomNode {
  name: string;
  childRooms?: RoomNode[];
}

@Component({
  selector: 'app-left-room-bar',
  templateUrl: './left-room-bar.component.html',
  styleUrls: ['./left-room-bar.component.scss']
})
export class LeftRoomBarComponent {
  
  treeControl = new NestedTreeControl<RoomNode>(node => node.childRooms);
  dataSource = new MatTreeNestedDataSource<RoomNode>();

  constructor() {
    this.dataSource.data;
  }

  hasChild = (_: number, node: RoomNode) => !!node.childRooms && node.childRooms.length > 0;

}
