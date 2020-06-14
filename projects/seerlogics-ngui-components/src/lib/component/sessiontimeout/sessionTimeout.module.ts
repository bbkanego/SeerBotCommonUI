import {NgModule} from '@angular/core';
import {SessionTimeoutComponent} from './sessionTimeout.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [SessionTimeoutComponent],
  declarations: [SessionTimeoutComponent],
  providers: [],
})
export class SessionTimeoutModule {
}
