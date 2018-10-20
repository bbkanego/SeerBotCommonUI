// https://stackoverflow.com/questions/36342890/in-angular2-how-to-know-when-any-form-input-field-lost-focus
import {Directive, Renderer2, ElementRef} from '@angular/core';

@Directive({
  selector: 'input,select',
  host: {'(blur)': 'onBlur($event)'}
})
export class BlurForwarderDirective {
  constructor(private elRef:ElementRef, private renderer:Renderer2) {}

  onBlur($event) {
    this.elRef.nativeElement.dispatchEvent(new CustomEvent('input-blur', { bubbles: true }));
    // or just
    // el.dispatchEvent(new CustomEvent('input-blur', { bubbles: true }));
    // if you don't care about webworker compatibility
  }
}
