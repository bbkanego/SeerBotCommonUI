import {Component, OnInit, Injector} from '@angular/core';
import {FormGroup, Validators, AbstractControl} from '@angular/forms';
import {CustomFormControl} from './modules/common/model/controls';
import {Option} from "./modules/common/model/models";
import {CustomValidator} from "./modules/common/validator/custom.validator";
import {CommonService} from "./modules/common/service/common.service";
import {BaseCustomComponent} from "./modules/common/component/BaseCustomComponent.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseCustomComponent implements OnInit {
  title = 'app';
  testForm: FormGroup;
  category: Option[];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.commonService.messages = {
      'message.field.required': 'This is required!'
    };

    this.category = [
      {value: '_NONE_', label: 'Select'},
      {value: 'cat1', label: 'Tennis'},
      {value: 'cat2', label: 'Golf'},
      {value: 'cat3', label: 'Football'},
      {value: 'cat3', label: 'Soccer'}
    ];
    this.testForm = new FormGroup(
      {
        'name': new CustomFormControl(null, null,
          [Validators.required, CustomValidator.isInteger], null),
        'lastName': new CustomFormControl(null, null,
          [Validators.required], null),
        'category': new CustomFormControl(null, null,
          [CustomValidator.isSelectValid('cat2')], null)
      }
    );
  }

  save() {
    this.markFormGroupTouched(this.testForm);
    console.log(this.testForm.valid);
  }
}
