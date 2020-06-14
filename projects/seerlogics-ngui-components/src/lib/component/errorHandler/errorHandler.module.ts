import {NgModule} from '@angular/core';

import {ErrorHandlerComponent} from './errorHandler.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [ErrorHandlerComponent],
  declarations: [ErrorHandlerComponent],
  providers: [],
})
export class ErrorHandlerModule {
}
