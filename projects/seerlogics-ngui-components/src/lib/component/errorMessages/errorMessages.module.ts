import {NgModule} from '@angular/core';

import {ErrorMessagesComponent} from './errorMessages.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from '../button/button.module';
import {ModalModule} from '../modal/modal.module';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, ButtonModule, ModalModule],
  exports: [ErrorMessagesComponent],
  declarations: [ErrorMessagesComponent],
  providers: [],
})
export class ErrorMessagesModule {
}
