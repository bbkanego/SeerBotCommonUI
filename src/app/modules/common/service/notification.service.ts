// http://plnkr.co/edit/ITnd5R5H4NRKqM9yy4Ir?p=preview
import {BehaviorSubject, Observable} from 'rxjs';
import {SUBSCRIBER_TYPES} from '../model/constants';

export interface Notification {
  type: string;
  message: any;
  subscriberType: string;
}

export class NotificationService {

  private notifications: BehaviorSubject<{}> = new BehaviorSubject<{}>({});

  constructor() {
  }

  notify(message: string, type: string, subscriberType: string) {
    this.notifications.next(
      {'type': type, 'message': message, 'subscriberType': subscriberType}
    );
  }

  notifyAny(message: any, type: string, subscriberType: string) {
    this.notifications.next(
      {type: type, message: message, subscriberType: subscriberType}
    );
  }

  notifyError(message: string) {
    this.notify(message, 'error', SUBSCRIBER_TYPES.ERROR_HANDLER);
  }

  notifyValidationError(message: string) {
    this.notify(message, 'validationError', SUBSCRIBER_TYPES.VALIDATION_ERROR);
  }

  notifyInfo(message: string) {
    this.notify(message, 'info', SUBSCRIBER_TYPES.LOGGER);
  }

  notifyWarning(message: string) {
    this.notify(message, 'warning', SUBSCRIBER_TYPES.WARNING);
  }

  notifyPrimary(message: string, subscriberType: string) {
    this.notify(message, 'primary', subscriberType);
  }

  notifySuccess(message: string, subscriberType: string) {
    this.notify(message, 'success', subscriberType);
  }

  onNotification(): Observable<{}> {
    return this.notifications.asObservable();
  }
}
