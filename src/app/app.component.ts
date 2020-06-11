import {FormGroup, Validators} from '@angular/forms';
import {BaseCustomComponent} from './modules/common/component/BaseCustomComponent.component';
import {CustomFormControl} from './modules/common/model/controls';
import {ChartData, ChartDataSet, Option} from './modules/common/model/models';
import {CustomValidator} from './modules/common/validator/custom.validator';
import {DynamicModalComponent, ModalComponent} from '../../public_api';
import {HelpExampleComponent} from './modules/test-components/help/help-example.component';
import {PopoutComponent} from './modules/common/component/popout/popout.component';
import {Component, Injector, OnInit, ViewChild} from '@angular/core';

export interface CommonModalModel {
  header: string;
  bodyMessage: string;
  buttonOk: string;
}

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

  chartData: ChartData;
  customModalData: CommonModalModel = {header: '', bodyMessage: '', buttonOk: ''};

  @ViewChild('customModal', {static: false}) testCustomModel: ModalComponent;

  constructor(injector: Injector) {
    super(injector);
  }

  showCustomModal() {
    this.customModalData = {header: 'Test Header', bodyMessage: 'Test Body Message', buttonOk: 'Done'};
    this.testCustomModel.show();
  }

  ngOnInit() {
    this.multiSelectStartValues = [{value: 'cat1', label: 'Tennis'},
      {value: 'cat3', label: 'Football'},
      {value: 'cat4', label: 'Soccer'}];
    this.multiSelectStartValues2 = [{value: 'cat1', label: 'Tennis'},
      {value: 'cat2', label: 'Golf'}];

    this.commonService.messages = {
      'message.field.required': 'This is required!'
    };

    this.category = [
      {value: '_NONE_', label: 'Select'},
      {value: 'cat1', label: 'Tennis'},
      {value: 'cat2', label: 'Golf'},
      {value: 'cat3', label: 'Football'},
      {value: 'cat4', label: 'Soccer'}
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

    const dataSets: ChartDataSet[] = [{
      label: 'Success',
      data: [80],
      backgroundColor: '#66cc00'
    } as ChartDataSet,
      {
        label: 'Failure',
        data: [5],
        backgroundColor: '#ff4000'
      } as ChartDataSet,
      {
        label: 'Maybe',
        data: [15],
        backgroundColor: '#ffff00'
      } as ChartDataSet,
    ];

    this.chartData = {type: 'bar', labels: ['Bot Performance'], dataSets: dataSets};
  }

  showDynamicModal() {
    const eventData = {
      extraData: {modalHeader: 'Dynamic Modal Example'},
      component: HelpExampleComponent
    };
    this.notificationService.notifyAny(eventData, DynamicModalComponent.SHOW_DYNAMIC_MODAL, DynamicModalComponent.SHOW_DYNAMIC_MODAL);
  }

  showPopout() {
    const eventData = {
      extraData: {modalHeader: 'Dynamic Popout Example', height: 500, width: 1000},
      component: HelpExampleComponent
    };
    this.notificationService.notifyAny(eventData, PopoutComponent.SHOW_POPOUT, PopoutComponent.SHOW_POPOUT);
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
