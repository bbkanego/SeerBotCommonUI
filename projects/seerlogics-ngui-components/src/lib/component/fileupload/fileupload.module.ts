import {NgModule} from '@angular/core';

import {FileUploadComponent} from './fileupload.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [FileUploadComponent],
  declarations: [FileUploadComponent],
  providers: [],
})
export class FileuploadModule {
}
