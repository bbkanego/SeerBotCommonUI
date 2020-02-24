import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {AppComponent} from './app.component';
import {HeaderModule} from './modules/header/header.module';
import {CommonUtilsModule} from './modules/common/commonUtils.module';
import {HttpModule} from '@angular/http';
import {NotificationService} from './modules/common/service/notification.service';
import {AuthenticationService} from './modules/common/service/authentication.service';
import {ValidationService} from './modules/common/service/validation.services';
import {CommonService} from './modules/common/service/common.service';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {TestComponentsModule} from "./modules/test-components/test-components.module";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HeaderModule, TestComponentsModule, CommonUtilsModule, BrowserAnimationsModule,
    HttpModule, ReactiveFormsModule, FormsModule, RouterModule.forRoot(routes)
  ],
  providers: [NotificationService, AuthenticationService,
    CommonService, ValidationService, {provide: 'environment', useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
