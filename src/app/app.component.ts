import {FormGroup, Validators} from '@angular/forms';
import {
  BaseCustomComponent,
  ChartData,
  ChartDataSet,
  CustomFormControl,
  CustomValidator,
  DynamicModalComponent,
  DynamicModalMetadata,
  ModalComponent,
  Option,
  PopoutComponent
} from 'seerlogics-ngui-components';
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {HelpExampleComponent} from './help/help.component';

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

  @ViewChild('customModal') testCustomModel: ModalComponent;

  constructor(injector: Injector) {
    super(injector);
  }

  displayDetails(data) {
    console.log(data);
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

    const chartOptions = {
      title: {
        display: true,
        text: 'Test Chart Options'
      }
    };

    this.chartData = {
      type: 'bar', labels: ['Bot Performance'],
      dataSets: dataSets, options: chartOptions
    };
  }

  showDynamicModal() {

    const ddm: DynamicModalMetadata = {
      extraData: {modalHeader: 'Dynamic Modal Example', showCloseX: true},
      component: HelpExampleComponent
    };
    this.notificationService.notifyAny(ddm, DynamicModalComponent.SHOW_DYNAMIC_MODAL, DynamicModalComponent.SHOW_DYNAMIC_MODAL);
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
