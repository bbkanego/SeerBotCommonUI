import {NgModule} from '@angular/core';
import {CheckboxComponent} from './checkbox.component';
import {CheckboxGroupComponent} from './checkboxGroup.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [CheckboxComponent,CheckboxGroupComponent],
  declarations: [CheckboxComponent,CheckboxGroupComponent],
  providers: [],
})
export class CheckboxModule {
}
