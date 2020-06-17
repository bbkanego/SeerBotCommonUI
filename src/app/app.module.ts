import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {
  AuthenticationService, ButtonModule, ChartModule, CommonService, InputModule, ModalModule, MultiSelectModule,
  NotificationService, PopoutModule, SelectorModule, TextareaModule, ValidationService
} from 'seerlogics-ngui-components';
import {HelpExampleComponent} from './help/help.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent, HelpExampleComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, InputModule, ButtonModule, ModalModule, TextareaModule,
    SelectorModule, MultiSelectModule, PopoutModule, ChartModule,
    HttpClientModule, ReactiveFormsModule, FormsModule, RouterModule.forRoot(routes)
  ],
  providers: [NotificationService, AuthenticationService,
    CommonService, ValidationService, {provide: 'environment', useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
