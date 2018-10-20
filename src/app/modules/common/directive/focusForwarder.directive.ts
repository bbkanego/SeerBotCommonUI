// https://stackoverflow.com/questions/36342890/in-angular2-how-to-know-when-any-form-input-field-lost-focus
import {Directive, Renderer2, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input,select'
})
export class FocusForwarderDirective {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('focus')
  onFocus($event) {
    this.elRef.nativeElement.dispatchEvent(new CustomEvent('input-focus', { bubbles: true }));
    // or just
    // el.dispatchEvent(new CustomEvent('input-blur', { bubbles: true }));
    // if you don't care about webworker compatibility
  }
}
