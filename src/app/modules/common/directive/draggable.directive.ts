import {Directive, ElementRef, Input, HostListener} from '@angular/core';

@Directive({
  selector: '[appBkDraggable]'
})

export class DraggableDirective {
  @Input() dragTarget;
  @Input() dragTargetParent;

  constructor(el: ElementRef) {
    el.nativeElement.setAttribute('draggable', 'true');
  }

  @HostListener('dragstart')
  onDragStart(ev: DragEvent) {
    // console.log("Drag Started = " + JSON.stringify(this.dragTarget));
    ev.dataTransfer.setData('draggedItem', JSON.stringify(this.dragTarget));
    ev.dataTransfer.setData('draggedItemParent', JSON.stringify(this.dragTargetParent));
  }
}
