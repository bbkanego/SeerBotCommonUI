// https://github.com/ivanderbu2/angular-redux/blob/master/src/app/core/loader/loader.component.ts
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {NotificationService} from '../../../common/service/notification.service';
import {SUBSCRIBER_TYPES} from '../../../common/model/constants';

@Component({
  selector: 'app-angular-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {

  show = false;
  subscription: Subscription;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.subscription = this.notificationService.onNotification().subscribe((eventData: any) => {
      if (eventData.subscriberType === SUBSCRIBER_TYPES.TOGGLE_LOADER) {
        this.show = eventData.message;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
