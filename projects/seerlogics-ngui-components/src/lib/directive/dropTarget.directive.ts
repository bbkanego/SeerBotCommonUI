import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {NotificationService} from '../service/notification.service';

@Directive({
  selector: '[appBkDropTarget]'
})
export class DropTargetDirective {
  @Input() dropTarget;
  private elementObj;

  constructor(private el: ElementRef, private notificationService: NotificationService) {
    this.el.nativeElement.setAttribute('draggable', 'true');
    this.elementObj = $(this.el.nativeElement);
  }

  @HostListener('dragover')
  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    const draggedItem = ev.dataTransfer.getData('draggedItem');
    /*console.log("onDragOver = " + JSON.stringify(draggedItem)
      + ", targetNode = " + JSON.stringify(this.dropTarget));*/
  }

  @HostListener('dragleave')
  onDragLeave(ev: DragEvent) {
    const draggedItem = ev.dataTransfer.getData('draggedItem');
    /*console.log("onDragLeave = " + JSON.stringify(draggedItem)
      + ", targetNode = " + JSON.stringify(this.dropTarget));*/
    this.elementObj.css({color: '#000'});
  }

  @HostListener('dragenter')
  onDragEnter(ev: DragEvent) {
    ev.preventDefault();
    const draggedItemObj = ev.dataTransfer.getData('draggedItem');
    /*console.log("draggedItemObj = " + draggedItemObj
      + ", targetNode = " + JSON.stringify(this.dropTarget));*/
    /*if (this.dropTarget.id === draggedItemObj.id) {
      this.elementObj.css({color: 'red'});
    } else {
      this.elementObj.css({color: 'green'});
    }*/
  }

  @HostListener('drop')
  onDrop(ev: DragEvent) {
    ev.preventDefault();
    const draggedItem = ev.dataTransfer.getData('draggedItem');
    const draggedItemParent = ev.dataTransfer.getData('draggedItemParent');
    const draggedItemObj = JSON.parse(draggedItem);
    const draggedItemParentObj = JSON.parse(draggedItemParent);

    const onDropData = {
      event: ev, draggedItem: draggedItemObj, draggedItemParent: draggedItemParentObj,
      dropTarget: this.dropTarget
    };

    this.notificationService.notifyAny(onDropData, 'OnDrop', 'OnDrop');
    /*console.log("onDrop dragged item = " + draggedItem + ", draggedItemParent = " + draggedItemParent
      + ", targetNode = " + JSON.stringify(this.dropTarget));*/
  }
}
