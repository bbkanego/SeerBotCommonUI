import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from '../../service/notification.service';
import {SUBSCRIBER_TYPES} from '../../model/constants';
import {NavigationStart, Router} from '@angular/router';
import {ModalComponent} from '../modal/modal.component';

@Component({
  selector: 'app-bk-error-messages',
  templateUrl: './errorMessages.component.html',
  styleUrls: ['./errorMessages.component.css']
})
export class ErrorMessagesComponent
  implements OnInit, OnDestroy, AfterViewInit {
  hasErrorMessages: boolean;
  fieldErrors: boolean;
  errorMessages: any;
  errorMessage: string = null;
  errorCode: string = null;
  referenceCode: string;
  @ViewChild('errorContainer') errorContainer: ElementRef;
  @ViewChild('errorsModal') errorsModal: ModalComponent;
  @Input()
  errorHeading = 'There were errors. Please fix before proceeding!';
  private sub: any;
  private navSub: any;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.navSub.unsubscribe();
  }

  ngAfterViewInit() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        /*//console.log("Mutations = " + JSON.stringify(mutation));
         this.fieldErrors = false;
         this.hasErrorMessages = false;*/
      });
    });
    const config = {attributes: true, childList: true, characterData: true};
    observer.observe(this.errorContainer.nativeElement, config);
  }

  ngOnInit(): void {
    this.sub = this.notificationService.onNotification().subscribe(
      (data: any) => {
        this.errorContainer.nativeElement.style.display = 'block';
        if (
          SUBSCRIBER_TYPES.PAGE_ERROR === data.subscriberType ||
          SUBSCRIBER_TYPES.ERROR_207 === data.subscriberType
        ) {
          this.showPageLevelValidationErrors(data);

          // $(this.errorContainer).offset().top;
        } else if (
          SUBSCRIBER_TYPES.ERROR_400 === data.subscriberType
        ) {
          if (data.message.pageLevelErrors) {
            this.showPageLevelValidationErrors(data);
          } else {
            this.errorMessage = data.message.errorMessage;
            this.errorCode = data.message.errorCode;
            this.referenceCode = data.message.referenceCode;
          }
        } else if (
          SUBSCRIBER_TYPES.ERROR_500 === data.subscriberType
        ) {
          this.errorHeading = 'Something Went Wrong!';
          this.errorMessage = data.message.errorMessage;
          this.errorCode = data.message.errorCode;
          this.referenceCode = data.message.referenceCode;
        }
      },
      error => console.log(error)
    );

    // https://stackoverflow.com/questions/37977428/how-to-use-new-navigationstart-angular-router-3-0-0-alpha
    this.navSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hasErrorMessages = false;
        this.fieldErrors = false;
        this.errorMessage = null;
      }
    });
  }

  hideErrorContainer() {
    this.errorContainer.nativeElement.style.display = 'none';
    this.hasErrorMessages = false;
    this.fieldErrors = false;
    this.errorMessages = null;
  }

  private showPageLevelValidationErrors(data: any) {
    console.log('Validation Error occurred: ', JSON.stringify(data.message)
    );
    this.errorMessages = data.message.pageLevelErrors;
    this.fieldErrors = data.message.fieldErrors.length > 0;
    this.hasErrorMessages = this.errorMessages.length > 0;

    this.errorsModal.show();
  }
}
