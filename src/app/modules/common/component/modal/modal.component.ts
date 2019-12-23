// http://jasonwatmore.com/post/2017/01/24/angular-2-custom-modal-window-dialog-box
import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';

/**
 * http://stackoverflow.com/questions/34513558/angular-2-0-and-modal-dialog
 * https://netbasal.com/dynamically-creating-components-with-angular-a7346f4a982d
 *
 * Modal with dynamic content! Insert one component into a modal!
 * https://plnkr.co/edit/5sjn25CV6QLbLIs2FcWp?p=preview
 *
 */
@Component({
  templateUrl: './modal.component.html',
  selector: 'app-bk-custom-modal',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  visible = false;
  visibleAnimate = false;
  @Output() modalState: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('modalBackdrop') modalBackdrop: ElementRef;
  @ViewChild('mainModal') mainModal: ElementRef;

  constructor() {

  }

  show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 200);
    this.modalState.emit('Shown!');
    this.modalBackdrop.nativeElement.style.display = 'block';
  }

  hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
    this.modalState.emit('hidden');
    this.modalBackdrop.nativeElement.style.display = 'none';
  }
}
