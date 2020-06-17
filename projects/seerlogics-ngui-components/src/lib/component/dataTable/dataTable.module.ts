import {NgModule} from '@angular/core';

import {
  BkTemplateDirective,
  ColumnBodyTemplateLoader,
  ColumnHeaderTemplateLoader,
  DataColumnComponent,
  DataTableComponent
} from './dataTable.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from '../button/button.module';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, ButtonModule],
  exports: [DataTableComponent, ColumnHeaderTemplateLoader, ColumnBodyTemplateLoader,
    DataColumnComponent, BkTemplateDirective],
  declarations: [DataTableComponent, ColumnHeaderTemplateLoader, ColumnBodyTemplateLoader,
    DataColumnComponent, BkTemplateDirective],
  providers: [],
})
export class DataTableModule {
}
