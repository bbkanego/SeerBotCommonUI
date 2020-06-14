import {NgModule} from '@angular/core';

import {DataTableComponent} from './dataTable.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [DataTableComponent],
  declarations: [DataTableComponent],
  providers: [],
})
export class DataTableModule {
}
