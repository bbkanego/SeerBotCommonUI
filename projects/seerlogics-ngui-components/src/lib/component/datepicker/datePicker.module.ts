import {NgModule} from '@angular/core';

import {DatePickerComponent} from './datepicker.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule],
  exports: [DatePickerComponent],
  declarations: [DatePickerComponent],
  providers: [],
})
export class DatePickerModule {
}
