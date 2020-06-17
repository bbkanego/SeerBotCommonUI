import {NgModule} from '@angular/core';
import {CheckboxComponent} from './checkbox.component';
import {CheckboxGroupComponent} from './checkboxGroup.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule],
  exports: [CheckboxComponent, CheckboxGroupComponent],
  declarations: [CheckboxComponent, CheckboxGroupComponent],
  providers: [],
})
export class CheckboxModule {
}
