import {NgModule} from '@angular/core';
import {SessionTimeoutComponent} from './sessionTimeout.component';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng';

@NgModule({
  imports: [CommonModule, DialogModule],
  exports: [SessionTimeoutComponent],
  declarations: [SessionTimeoutComponent],
  providers: [],
})
export class SessionTimeoutModule {
}
