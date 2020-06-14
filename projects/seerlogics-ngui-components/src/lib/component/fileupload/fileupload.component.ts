import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {HttpClientHelper} from '../../service/httpClient.helper';
import {UtilsService} from '../../service/utils.service';
import {Dialog} from 'primeng/primeng';

@Component({
  selector: 'app-bk-fileupload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent {
  @Input() showComplexFileUpload = false;
  @Input() showSimpleFileUpload = false;
  @Input() multiple = false;
  @Input() uploadUrl = 'NONE';
  @Output() onBeforeSendEmitter: EventEmitter<any> = new EventEmitter();
  @Output() onBeforeUploadEmitter: EventEmitter<any> = new EventEmitter();
  @Output() onUploadEmitter: EventEmitter<any> = new EventEmitter();
  @Output() onErrorEmitter: EventEmitter<any> = new EventEmitter();
  @Output() onProgressEmitter: EventEmitter<any> = new EventEmitter();
  fileUpload: any;
  showProgress = false;
  uploadButtonLabel = 'Upload File';

  @ViewChild('fileInput', {static: false}) inputEl: ElementRef;

  constructor(private httpClientHelper: HttpClientHelper) {
  }

  onBeforeSend(event) {
    const currentUser = JSON.parse(UtilsService.getCurrentUser());
    event.xhr.setRequestHeader('Authorization', currentUser.token);
    this.onBeforeSendEmitter.emit(event);
  }

  onBeforeUpload(event) {
    this.onBeforeUploadEmitter.emit(event);
  }

  onUpload(event) {
    this.onUploadEmitter.emit(event);
  }

  onError(event) {
    this.onErrorEmitter.emit(event);
  }

  onProgress(event) {
    console.log('Current progress = ' + event.progress);
    this.onProgressEmitter.emit(event);
  }

  /**
   * https://stackoverflow.com/questions/36352405/file-upload-with-angular2-to-rest-api/39862337#39862337
   * https://gist.github.com/Toxicable/1c736ed16c95bcdc7612e2c406b5ce0f
   */
  uploadFile() {
    this.showProgress = true;
    this.uploadButtonLabel = 'Uploading...';
    const inputEl = this.inputEl.nativeElement;
    if (inputEl.files.length === 0) {
      console.log('No files selected. Returning...');
      return;
    }
    if ('NONE' === this.uploadUrl) {
      console.log('Upload URL is not defined. Returning...');
      return;
    }

    const files: FileList = inputEl.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('fileUpload', files[i], files[i].name);
    }

    this.httpClientHelper.postMultipart(this.uploadUrl, formData).subscribe((response) => {
      this.showProgress = false;
      console.log('Got response!');
      this.uploadButtonLabel = 'Done';
      setTimeout(() => {
        this.uploadButtonLabel = 'Upload File';
      }, 2000);
    });
  }
}
