import {AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as JQuery from 'jquery';

import {BaseCustomComponent} from '../BaseCustomComponent.component';
import {Dialog} from 'primeng/primeng';

const $ = JQuery;

@Component({
  selector: 'app-bk-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
/**
 * Source of Calendar: /Users/bkane/svn/code/angular/primeng-master/components/calendar/calendar.ts
 */
export class InputComponent extends BaseCustomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bkInputWidget', {static: false}) bkInputWidget: ElementRef;
  @Input() inputType = 'text';
  private input;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onBlurEvent($event) {
    this.elementBlurred = true;
    const widgetObj = $(this.bkInputWidget.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit($event);
  }
}
