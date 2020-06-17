import {NgModule} from '@angular/core';

import {FileUploadComponent} from './fileupload.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'primeng';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, FileUploadModule],
  exports: [FileUploadComponent],
  declarations: [FileUploadComponent],
  providers: [],
})
export class FileuploadModule {
}
