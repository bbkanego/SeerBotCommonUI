import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
/*import {
  AuthenticationService, ButtonModule, ChartModule, CommonService, InputModule, ModalModule, MultiSelectModule,
  NotificationService, PopoutModule, SelectorModule, TextareaModule, ValidationService, TypeaheadModule
} from 'seerlogics-ngui-components';*/
import {HelpExampleComponent} from './help/help.component';
import {InputModule} from '../../projects/seerlogics-ngui-components/src/lib/component/input/input.module';
import {ButtonModule} from '../../projects/seerlogics-ngui-components/src/lib/component/button/button.module';
import {ModalModule} from '../../projects/seerlogics-ngui-components/src/lib/component/modal/modal.module';
import {TextareaModule} from '../../projects/seerlogics-ngui-components/src/lib/component/textarea/textarea.module';
import {SelectorModule} from '../../projects/seerlogics-ngui-components/src/lib/component/selector/selector.module';
import {MultiSelectModule} from '../../projects/seerlogics-ngui-components/src/lib/component/multiSelect/multiSelect.module';
import {PopoutModule} from '../../projects/seerlogics-ngui-components/src/lib/component/popout/popout.module';
import {ChartModule} from '../../projects/seerlogics-ngui-components/src/lib/component/chart/chart.module';
import {TypeaheadModule} from '../../projects/seerlogics-ngui-components/src/lib/component/typeahead/typeahead.module';
import {NotificationService} from '../../projects/seerlogics-ngui-components/src/lib/service/notification.service';
import {AuthenticationService} from '../../projects/seerlogics-ngui-components/src/lib/service/authentication.service';
import {CommonService} from '../../projects/seerlogics-ngui-components/src/lib/service/common.service';
import {ValidationService} from '../../projects/seerlogics-ngui-components/src/lib/service/validation.services';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent, HelpExampleComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, InputModule, ButtonModule, ModalModule, TextareaModule,
    SelectorModule, MultiSelectModule, PopoutModule, ChartModule, TypeaheadModule,
    HttpClientModule, ReactiveFormsModule, FormsModule, RouterModule.forRoot(routes), TypeaheadModule
  ],
  providers: [NotificationService, AuthenticationService,
    CommonService, ValidationService, {provide: 'environment', useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
