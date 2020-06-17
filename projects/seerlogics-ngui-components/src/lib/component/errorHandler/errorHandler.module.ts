import {NgModule} from '@angular/core';

import {ErrorHandlerComponent} from './errorHandler.component';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng';
import {ModalModule} from '../modal/modal.module';

@NgModule({
  imports: [CommonModule, DialogModule, ModalModule],
  exports: [ErrorHandlerComponent],
  declarations: [ErrorHandlerComponent],
  providers: [],
})
export class ErrorHandlerModule {
}
