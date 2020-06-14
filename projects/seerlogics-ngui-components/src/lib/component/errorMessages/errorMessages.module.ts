import {NgModule} from '@angular/core';

import {ErrorMessagesComponent} from './errorMessages.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [ErrorMessagesComponent],
  declarations: [ErrorMessagesComponent],
  providers: [],
})
export class NameModule {
}
