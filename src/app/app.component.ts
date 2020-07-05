import {FormGroup, Validators} from '@angular/forms';
import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {HelpExampleComponent} from './help/help.component';
import {BaseCustomComponent} from '../../projects/seerlogics-ngui-components/src/lib/component/baseCustom.component';
import {ChartData, ChartDataSet, Option} from '../../projects/seerlogics-ngui-components/src/lib/model/models';
import {ModalComponent} from '../../projects/seerlogics-ngui-components/src/lib/component/modal/modal.component';
import {CustomFormControl} from '../../projects/seerlogics-ngui-components/src/lib/model/controls';
import {CustomValidator} from '../../projects/seerlogics-ngui-components/src/lib/validator/custom.validator';
import {
  DynamicModalComponent,
  DynamicModalMetadata
} from '../../projects/seerlogics-ngui-components/src/lib/component/modal/dynamicModal.component';
import {PopoutComponent} from '../../projects/seerlogics-ngui-components/src/lib/component/popout/popout.component';

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
  displayValues: string[] = [];

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
    this.displayValues = this.getCountries();
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

  private getCountries() {
    return ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina",
      "Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus",
      "Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil",
      "British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
      "Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo",
      "Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark",
      "Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea",
      "Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia",
      "French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland",
      "Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong",
      "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey"
      ,"Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia",
      "Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali",
      "Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro",
      "Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles",
      "New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau",
      "Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico",
      "Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino",
      "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia",
      "Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia",
      "St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
      "Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda",
      "Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City",
      "Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
  }
}
