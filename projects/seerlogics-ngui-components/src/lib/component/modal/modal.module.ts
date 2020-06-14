import {NgModule} from '@angular/core';

import {ModalComponent} from './modal.component';
import {DynamicModalComponent} from './dynamicModal.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [ModalComponent, DynamicModalComponent],
  declarations: [ModalComponent, DynamicModalComponent],
  providers: [],
})
export class ModalModule {
}
