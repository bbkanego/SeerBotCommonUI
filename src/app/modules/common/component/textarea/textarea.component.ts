import { AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as JQuery from 'jquery';
import { Subscription } from 'rxjs/Subscription';

import { BaseCustomComponent } from '../BaseCustomComponent.component';
import { SUBSCRIBER_TYPES } from '../../model/constants';

const $ = JQuery;

@Component({
  selector: 'app-bk-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent extends BaseCustomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bkInputWidget') bkInputWidget: ElementRef;

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
