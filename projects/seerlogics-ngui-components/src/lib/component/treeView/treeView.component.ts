import {Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseCustomComponent} from '../BaseCustomComponent.component';
import {Subscription} from 'rxjs';

export interface TreeNode {
  id: string;
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
}

@Component({
  selector: 'bk-treeNode',
  templateUrl: './treeNode.component.html',
  styleUrls: ['./treeView.component.css']
})
export class TreeNodeComponent extends BaseCustomComponent implements OnInit, OnDestroy {
  @Input() node: TreeNode;
  @Input() parentNode: TreeNode;
  openedClass = 'glyphicon-minus-sign';
  closedClass = 'glyphicon-plus-sign';
  nodeStateClass: string = 'trigger glyphicon ' + this.closedClass;
  isOpen = false;
  private notificationSubscription: Subscription;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.onNotification().subscribe((event: any) => {
      if (event.type === 'OnDropCompleted_' + this.node.id) {
        this.node = event.message;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  onNodeSelect(event) {
    event.stopPropagation();
    const eventData = {event: event, node: this.node};
    this.notificationService.notifyAny(eventData, 'OnNodeSelect', 'OnNodeSelect');
  }

  triggerClick(event) {
    event.stopPropagation();
    const eventData = {event: event, node: this.node};
    if (!this.isOpen) {
      if (!this.node.children || this.node.children.length === 0) {
        // console.log("Current node = " + eventData.node.label);
        this.nodeStateClass = 'trigger glyphicon ' + this.openedClass;
        this.notificationService.notifyAny(eventData, 'NodeTriggerClicked', 'NodeTriggerClicked');
        this.isOpen = true;
      } else {
        this.isOpen = true;
        this.nodeStateClass = 'trigger glyphicon ' + this.openedClass;
      }
    } else {
      this.isOpen = false;
      this.nodeStateClass = 'trigger glyphicon ' + this.closedClass;
    }
  }

  // @HostListener('dragstart', ['$event'])
  onDragStart(event: Event) {
    console.log('Starting drag = ' + event);
  }

  onContextMenuLocal(event) {
    event.stopPropagation();
    const eventData = {event: event, node: this.node};
    // console.log("CM Current node = " + eventData.node.label);
    this.notificationService.notifyAny(eventData, 'OnContextMenu', 'OnContextMenu');
    event.preventDefault();
  }
}

@Component({
  selector: 'bk-treeView',
  templateUrl: './treeView.component.html',
  styleUrls: ['./treeView.component.css']
})
export class TreeViewComponent extends BaseCustomComponent implements OnInit, OnDestroy {
  @Input() nodes: TreeNode[] = [];
  errorMessage: string;
  showError: boolean;
  private notificationSubscription: Subscription;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  onContextMenuLocal(event) {
    // prevent right click on the tree!
    event.preventDefault();
  }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.onNotification().subscribe((event: any) => {
      if (event.type === 'NodeTriggerClicked') {
        this.onClick.emit(event.message);
      } else if (event.type === 'OnContextMenu') {
        this.onContextMenu.emit(event.message);
      } else if (event.type === 'OnNodeSelect') {
        this.onSelect.emit(event.message);
      } else if (event.type === 'OnDrop') {
        this.onDrop.emit(event.message);
      } else if (event.type === 'InValidDropTarget') {
        this.errorMessage = 'Invalid parent selected';
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    });
  }
}
