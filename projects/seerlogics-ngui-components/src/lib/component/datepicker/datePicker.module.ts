import {NgModule} from '@angular/core';

import {DatePickerComponent} from './datepicker.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [DatePickerComponent],
  declarations: [DatePickerComponent],
  providers: [],
})
export class DatePickerModule {
}
