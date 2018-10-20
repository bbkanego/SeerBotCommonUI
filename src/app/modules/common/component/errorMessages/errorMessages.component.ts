import {Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {NotificationService} from '../../../common/service/notification.service';
import {SUBSCRIBER_TYPES} from '../../../common/model/constants';
import { Router, NavigationStart } from '@angular/router';

@Component({
  'selector': 'app-bk-error-messages',
  'templateUrl': './errorMessages.component.html'
})
export class ErrorMessagesComponent implements OnInit, OnDestroy, AfterViewInit {
  hasErrorMessages: boolean;
  fieldErrors: boolean;
  errorMessages: any;
  private sub: any;
  private navSub: any;
  @ViewChild('errorContainer') errorContainer: ElementRef;

  constructor(private notificationService: NotificationService, private router: Router) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.navSub.unsubscribe();
  }

  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        /*//console.log("Mutations = " + JSON.stringify(mutation));
         this.fieldErrors = false;
         this.hasErrorMessages = false;*/
      })
    });
    const config = {attributes: true, childList: true, characterData: true};
    observer.observe(this.errorContainer.nativeElement, config);
  }

  ngOnInit(): void {
    this.sub = this.notificationService.onNotification().subscribe(
      (data: any) => {
        if (SUBSCRIBER_TYPES.PAGE_ERROR === data.subscriberType) {
          console.log('Validation Error occurred: ', JSON.stringify(data.message));
          this.errorMessages = data.message.pageLevelErrors;
          this.fieldErrors = data.message.fieldErrors;
          this.hasErrorMessages = this.errorMessages.length > 0;

          // $(this.errorContainer).offset().top;
        }
      },
        error => console.log(error)
    );

    // https://stackoverflow.com/questions/37977428/how-to-use-new-navigationstart-angular-router-3-0-0-alpha
    this.navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.hasErrorMessages = false;
        this.fieldErrors = false;
      }
    });
  }
}
