import {AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Option} from '../../model/models';
import {CustomValidator} from '../../validator/custom.validator';
import {BaseCustomComponent} from '../baseCustom.component';

@Component({
  selector: 'app-bk-multi-select',
  templateUrl: './multiSelect.component.html',
  styleUrls: ['./multiSelect.component.css']
})
export class MultiSelectComponent extends BaseCustomComponent
  implements OnInit, OnDestroy, AfterViewInit {

  @Input() options: Option[];
  @ViewChild('selectWidget') selectWidget: ElementRef;
  selectedValues: string[] = [];
  @Input() startingValues: any[] = [];
  @Input() noneLabel = 'None Selected';

  constructor(injector: Injector) {
    super(injector);
  }

  get showSelectedValues(): string {
    const selectedLabels: string[] = [];
    if (this.selectedValues.length > 0) {
      this.selectedValues.forEach((value) => {
        this.options.forEach(option => {
          if (option.value === value) {
            selectedLabels.push(option.label);
          }
        });
      });
      return selectedLabels.join();
    }
    return this.noneLabel;
  }

  isSelected(valueToCheck: string): boolean {
    return this.selectedValues && this.selectedValues.indexOf(valueToCheck) !== -1;
  }

  ngOnInit(): void {
    this.initFormGroup();
  }

  ngAfterViewInit() {
    this.selectedValues = [];
    // this.startingValues = [];
    if (this.startingValues) {
      this.startingValues.forEach((startValue) => {
        this.selectedValues.push(startValue.value);
      });
    } else {
      this.selectedValues = [];
    }
    this.setControlValue();

    if (this.getFormControl().validationRules['required']) {
      this.getFormControl().setValidators([CustomValidator.isSelectValid()]);
    }
  }

  ngOnDestroy() {
  }

  onChange(event) {
    this.setControlValue();
    const values = this.selectedValues;
    this.onSelect.emit(values);
  }

  onFocusEvent(event) {
    this.getFormControl().markAsTouched();
    this.onFocus.emit(event);
    console.log('focused errors = ' + this.getFormControl().errors
      + ', value = ' + this.getFormControl().value
      + ', invalid = ' + this.currentFormGroup.invalid
      + ', touched = ' + this.getFormControl().touched + ', isInvalid() = ' + this.isInvalid());
  }

  selectValue(event) {
    const checkBox = event.target;
    const value = checkBox.value;
    if (value && value.length > 0 && value !== '_NONE_') {
      if (checkBox.checked) {
        this.selectedValues.push(value);
      } else {
        const index = this.selectedValues.indexOf(value);
        if (index > -1) {
          this.selectedValues.splice(index, 1);
        }
      }
    }
  }

  private setControlValue() {
    this.getFormControl().setValue(null);
    if (this.selectedValues.length > 0) {
      this.getFormControl().setValue(this.selectedValues.join());
    }
  }
}
