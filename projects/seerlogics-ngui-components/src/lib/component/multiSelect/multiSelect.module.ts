import {NgModule} from '@angular/core';
import {MultiSelectComponent} from './multiSelect.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [MultiSelectComponent],
  declarations: [MultiSelectComponent],
  providers: [],
})
export class MultiSelectModule {
}
