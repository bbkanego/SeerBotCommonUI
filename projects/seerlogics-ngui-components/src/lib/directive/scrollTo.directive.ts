import {AfterViewInit, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[scrollTo]'
})
export class ScrollToDirective implements AfterViewInit {
  constructor(private elRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.elRef.nativeElement.scrollIntoView();
  }
}
