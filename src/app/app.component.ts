import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseCustomComponent } from "./modules/common/component/BaseCustomComponent.component";
import { CustomFormControl } from './modules/common/model/controls';
import { Option } from "./modules/common/model/models";
import { CustomValidator } from "./modules/common/validator/custom.validator";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseCustomComponent implements OnInit {
  title = 'app';
  testForm: FormGroup;
  category: Option[];
  multiSelectStartValues: any[] = [];
  multiSelectStartValues2: any[] = [];
  selectedValuesForMultiSelect: string[] = [];
  selectedValuesForMultiSelect2: string[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.multiSelectStartValues = [{ value: 'cat1', label: 'Tennis' },
    { value: 'cat3', label: 'Football' },
    { value: 'cat4', label: 'Soccer' }];
    this.multiSelectStartValues2 = [{ value: 'cat1', label: 'Tennis' },
    { value: 'cat2', label: 'Golf' }];

    this.commonService.messages = {
      'message.field.required': 'This is required!'
    };

    this.category = [
      { value: '_NONE_', label: 'Select' },
      { value: 'cat1', label: 'Tennis' },
      { value: 'cat2', label: 'Golf' },
      { value: 'cat3', label: 'Football' },
      { value: 'cat4', label: 'Soccer' }
    ];
    this.testForm = new FormGroup(
      {
        'name': new CustomFormControl(null, null,
          [Validators.required, CustomValidator.isInteger], null),
        'lastName': new CustomFormControl(null, null,
          [Validators.required], null),
        'category': new CustomFormControl(null, null,
          [CustomValidator.isSelectValid('cat2')], null),
        'multiSelectCategory': new CustomFormControl(null, null,
          [Validators.required], null),
        'multiSelectCategory2': new CustomFormControl(null, null,
          [Validators.required], null)
      }
    );
  }

  save() {
    this.markFormGroupTouched(this.testForm);
    console.log(this.testForm.valid);
  }

  showSelectedValues(values) {
    console.log(values);
    this.selectedValuesForMultiSelect = values;
  }

  showSelectedValues2(values) {
    console.log(values);
    this.selectedValuesForMultiSelect2 = values;
  }

  changeMultiSelectValues() {
    this.multiSelectStartValues = ['cat1'];
    this.multiSelectStartValues2 = ['cat3'];
  }
}
