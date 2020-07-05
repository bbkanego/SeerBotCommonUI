import {Component, ElementRef, forwardRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseCustomComponent} from '../baseCustom.component';
import * as $ from 'jquery';
import {UtilsService} from '../../service/utils.service';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'seer-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeaheadComponent),
      multi: true,
    }
  ]
})
export class TypeaheadComponent extends BaseCustomComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild('thInputWidget') inputWidget: ElementRef;
  @Input() inputType = 'text';
  private onChange: Function;
  private onTouched: Function;

  showThLayer: boolean = false;
  showError: boolean = false;
  currentIndex = -1;
  matchingItemCount = 0;
  idPrefix;
  inputClassPrefix = 'taInput';

  // this represents the actual values that the user has provided.
  @Input()
  displayValues: string[] = [];

  // this displays the values that actually match based on what the user entered.
  matchingDisplayValues: string[] = [];

  @ViewChild('typeAheadSuggestions') typeAheadSuggestions: ElementRef;

  private keyUpSubject: Subject<boolean> = new Subject();
  private keyUpFilterSubject: Subject<string> = new Subject();

  constructor(injector: Injector) {
    super(injector);
  }

  onFocusEvent(data) {
    // this.showThLayer = true;
  }

  onBlurEvent($event) {
    this.elementBlurred = true;
    const widgetObj = $(this.inputWidget.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit($event);
    this.showThLayer = false;
  }

  filterMatchingValues(input: string) {
    this.matchingDisplayValues = this.displayValues.filter((value: string) => {
      return value.toLowerCase().startsWith(input.toLowerCase());
    });
  }

  handleKeyUp(event: KeyboardEvent) {

  }

  handleKeyDown(event: KeyboardEvent) {
    this.showThLayer = true;
    if (!this.typeAheadSuggestions) {
      return;
    }

    const typeAheadSuggestObj = $(this.typeAheadSuggestions.nativeElement);
    console.log('key down pressed: ' + event.target + ', ' + typeAheadSuggestObj.attr('class'));
    let keyPressed;
    if (event.key !== undefined) {
      keyPressed = event.key;
    } else if (event.keyCode !== undefined) {
      keyPressed = event.keyCode;
    }
    console.log('keyPressed = ' + keyPressed);
    this.keyUpFilterSubject.next(keyPressed);
    if (keyPressed == 'ArrowDown') {
      this.keyUpSubject.next(true);
    } else if (keyPressed == 'ArrowUp') { //up
      this.keyUpSubject.next(false);
    } else if (keyPressed == 'Enter') {
      this.getFormControl().setValue($('#' + this.idPrefix + (this.currentIndex)).val());
    }
  }

  private filterOnKeyDown(keyPressed) {
    const inputObj = $(this.inputWidget.nativeElement);
    console.log('--------------------------' + inputObj.val() + ', currentIndex = ' + this.currentIndex
      + ', length = ' + this.matchingDisplayValues.length);
    if (keyPressed !== 'ArrowDown' && keyPressed !== 'ArrowDown' && keyPressed !== 'Enter') {
      this.filterMatchingValues(inputObj.val());
    }
  }

  private moveUpDown(increment: boolean) {
    if (increment && this.currentIndex >= (this.matchingDisplayValues.length - 1)) {
      this.currentIndex = 0;
    } else {
      if (increment) {
        this.currentIndex++;
      } else {
        this.currentIndex--;
      }
    }
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    $('.' + this.getInputClassPrefix()).parent('li').removeClass('optionFocus');
    $('#' + this.idPrefix + (this.currentIndex)).parent('li').addClass('optionFocus');
  }

  ngOnInit(): void {
    this.keyUpSubject.pipe(debounceTime(0)).subscribe((increment: boolean) => {
      this.moveUpDown(increment);
    });
    this.keyUpFilterSubject.pipe(debounceTime(0)).subscribe((increment: string) => {
      this.filterOnKeyDown(increment);
    });

    this.idPrefix = 'ta' + UtilsService.getRandomIntExclusive(1000, 9000);
    this.matchingDisplayValues = this.displayValues;
    this.matchingItemCount = this.matchingDisplayValues.length;
  }

  getInputClassPrefix() {
    return this.idPrefix + this.inputClassPrefix;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }

  onClickOutsideCallback() {
    this.showError = true;
    this.showThLayer = false;
    console.log('sdfsdfsdfsdf');
  }

  ngOnDestroy(): void {
    this.keyUpSubject.unsubscribe();
    this.keyUpFilterSubject.unsubscribe();
  }

}
