import {AfterViewInit, Component, ElementRef, forwardRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';

import {BaseCustomComponent} from '../baseCustom.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'seer-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    }
  ]
})
/**
 * Source of Calendar: /Users/bkane/svn/code/angular/primeng-master/components/calendar/calendar.ts
 */
export class InputComponent extends BaseCustomComponent implements OnInit, AfterViewInit,
  OnDestroy, ControlValueAccessor {
  @ViewChild('bkInputWidget') bkInputWidget: ElementRef;
  @Input() inputType = 'text';
  private onChange: Function;
  private onTouched: Function;

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

  /**
   * Write a new value to the element.
   */
  writeValue(obj: any): void {
  }

  /**
   * Set the function to be called when the control receives a change event.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * This function is called when the control status changes to or from "DISABLED".
   * Depending on the value, it will enable or disable the appropriate DOM element.
   * @param isDisabled
   */

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
