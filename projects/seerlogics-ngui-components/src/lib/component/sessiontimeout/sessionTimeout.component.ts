import {Component, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from '../../service/notification.service';
import {Dialog} from 'primeng/primeng';
import {Subscription} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-bk-session-timeout',
  templateUrl: './sessionTimeout.component.html'
})
export class SessionTimeoutComponent implements OnInit, OnDestroy {

  @Input() sessionTimeOutInMins = 30;
  sessionTimeOutInSeconds = 0;
  timeoutMessageDisplayInSeconds = 5 * 60;
  @ViewChild(Dialog, {static: false}) sessionDialog: Dialog;
  sessionTimeoutHeading = 'Session Ending';
  sessionTimeoutMessage = 'Your session is about to end!';
  intervalTracker: any;
  private lastActivityTimestamp: number = Date.now();
  private sub: Subscription;
  private navSub: Subscription;

  constructor(private notificationService: NotificationService, private router: Router) {
  }

  ngOnInit(): void {

    // start by resetting the timeout
    this.resetTimeout();

    this.sub = this.notificationService.onNotification().subscribe(
      (data: any) => {
        if ('ACTIVITY_PING' === data.subscriberType) {
          this.resetTimeout();
        }
      },
      error => console.log(error)
    );

    this.navSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.resetTimeout();
      }
    });

    this.intervalTracker = setInterval(() => {
      // disable session popup: this.checkSessionTimeout();
    }, 10000);

    this.sessionTimeOutInSeconds = this.sessionTimeOutInMins * 60;
    // this.sessionTimeOutInSeconds = 20; -- for testing
    // this.timeoutMessageDisplayInSeconds = 10 -- for testing
  }

  /**
   * https://stackoverflow.com/questions/34719324/angular-2-host-binding-and-host-listening
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    this.resetTimeout();
  }

  showSessionDialog() {
    this.sessionDialog.visible = true;
  }

  hideSessionDialog() {
    this.sessionDialog.visible = false;
  }

  continueSession() {
    this.resetTimeout();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalTracker);
    this.sub.unsubscribe();
    this.navSub.unsubscribe();
  }

  private resetTimeout() {
    this.lastActivityTimestamp = Date.now();
    this.hideSessionDialog();
  }

  private checkSessionTimeout() {
    const elapsedTimeInSeconds = (Date.now() - this.lastActivityTimestamp) / 1000;
    // console.log('current time = ' + elapsedTimeInSeconds);
    if ((elapsedTimeInSeconds >= (this.sessionTimeOutInSeconds - this.timeoutMessageDisplayInSeconds))
      && !this.sessionDialog.visible) {
      this.showSessionDialog();
    } else if (elapsedTimeInSeconds >= (this.sessionTimeOutInSeconds)) {
      clearInterval(this.intervalTracker);
      this.notificationService.notify('Logout was a success', 'ForcedLogout', 'ForcedLogout');
    }
  }
}
