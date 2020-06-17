import {AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as JQuery from 'jquery';

import {BaseCustomComponent} from '../baseCustom.component';

const $ = JQuery;

@Component({
  selector: 'app-bk-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent extends BaseCustomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bkInputWidget') bkInputWidget: ElementRef;

  @Input() textAreaLength: number = null;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.initFormGroup();
    const validationRules = this.getFormControl().validationRules;
    if (validationRules['validateMaxLength']) {
      this.textAreaLength = validationRules['vars'].maxLength.value;
    }
  }

  getNumberOfCharsLeft(): string {
    if (!this.textAreaLength || !this.getFormControl().value) {
      return null;
    }

    return this.textAreaLength - this.getFormControl().value.length + ' chars left';
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
