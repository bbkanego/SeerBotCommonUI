import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[seerLostFocus]'
})
export class LostFocusDirective {
  @Output('seerLostFocus')
  seerLostFocus = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef) {
  }

  @HostListener('blur')
  onBlur(targetElement): void {
    console.log('sdfsdfsdfsdf23232323');
    //this.seerLostFocus.emit();
  }
}
