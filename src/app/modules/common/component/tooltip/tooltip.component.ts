import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';

import * as JQuery from 'jquery';

const $ = JQuery;

@Component({
  selector: 'app-bk-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit, AfterViewInit {
  @Input() tooltipText;
  @Input() targetElementRef: HTMLElement;
  @Input() position = 'right';
  @ViewChild('tooltipContainer') tooltipContainerRef: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // this.renderer.setStyle(this.tooltipContainerRef, 'font-size', '40px');
  }

  ngAfterViewInit() {
    const targElementObj = $(this.targetElementRef);
    targElementObj.css({ position: 'relative', display: 'inline-block' });
    const toolTipObj = $(this.tooltipContainerRef.nativeElement);
    // display right
    let endingRight;
    if (this.position === 'right') {
      endingRight =
        targElementObj.position().left + targElementObj.outerWidth() + 10;
      toolTipObj.css({
        top: targElementObj.position().top + targElementObj.outerHeight() / 3,
        left: endingRight,
        display: 'none'
      });
    } else if (this.position === 'bottom') {
      endingRight =
        targElementObj.position().left + targElementObj.outerWidth() / 2;
      toolTipObj.css({
        top: targElementObj.position().top + targElementObj.outerHeight() + 10,
        left: endingRight - toolTipObj.width() / 2,
        display: 'none'
      });
    }

    targElementObj.mouseover(() => {
      toolTipObj.css({ display: 'block' });
    });

    targElementObj.mouseout(() => {
      toolTipObj.css({ display: 'none' });
    });
  }
}
