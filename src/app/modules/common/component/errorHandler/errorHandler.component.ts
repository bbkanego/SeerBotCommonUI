import {Component, ViewChild, OnChanges, Input, OnInit, OnDestroy} from '@angular/core';
import {ModalComponent} from '../../../common/component/modal/modal.component';
import {NotificationService} from '../../../common/service/notification.service'
import {Dialog} from 'primeng/primeng';

@Component({
  selector: 'app-bk-error-handler',
  templateUrl: './errorHandler.component.html'
})
export class ErrorHandler implements OnInit, OnDestroy {
  @Input() handlerType: string;
  @Input() errorHandlerHeading: string;

  @ViewChild(ModalComponent) errorModal: ModalComponent;
  @ViewChild(Dialog) errorDialog: Dialog;

  // private subscriberType:string = handlerType;
  exceptionDetails: string;
  modalState: string;
  private sub: any;

  constructor(private notificationService: NotificationService) {
  }

  showErrorMessage(message: string): void {
    this.errorModal.show();
  }

  errorModelState($event): void {
    this.modalState = $event;
  }

  hideErrorDialog(): void {
    this.errorDialog.visible = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.sub = this.notificationService.onNotification().subscribe(
      (data: any) => {
        if (this.handlerType === data.subscriberType) {
          console.log('notification', data.message);
          this.exceptionDetails = data.message;
          // this.errorModal.show();
          this.errorDialog.visible = true;
        }
      },
        error => console.log(error)
    );
  }
}
