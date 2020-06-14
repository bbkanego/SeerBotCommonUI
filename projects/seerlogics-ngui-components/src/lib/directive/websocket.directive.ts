import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from '../service/notification.service';
import {StompService} from '../service/stomp.service';
import {UtilsService} from '../service/utils.service';

@Directive({
  selector: 'app-bk-websocket',
  providers: [StompService]
})
export class WebSocketDirective implements OnInit, OnDestroy {

  @Input() hostUrl: string;
  @Input() subscriptionUrl: string;
  @Input() notifyEvent: string;
  private subscription: any;
  private headers = {};

  constructor(private stomp: StompService, private notificationService: NotificationService) {
  }

  setUpStomp() {
    const currentUser = JSON.parse(UtilsService.getCurrentUser());
    if (currentUser && currentUser.token) {
      this.headers['Authorization'] = currentUser.token;
    }

    this.stomp.stompConfig = {
      host: this.hostUrl + '?token=' + currentUser.token,
      debug: false,
      headers: this.headers,
      queue: {'init': false}
    };
  }

  connect() {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      this.subscription = this.stomp.subscribe(this.subscriptionUrl,
        this.handleResponse.bind(this), this.headers);
    });
  }


  ngOnInit(): void {
    this.setUpStomp();
    this.connect();
  }

  ngOnDestroy(): void {
    // unsubscribe
    this.subscription.unsubscribe();

    // disconnect
    this.stomp.disconnect().then(() => {
      // console.log('Connection closed')
    });
  }

  // response
  private handleResponse(data) {
    // console.log("data received = " + JSON.stringify(data));
    const chartData = {'chartData': data};
    this.notificationService.notifyAny(chartData, this.notifyEvent, this.notifyEvent);
  }
}
