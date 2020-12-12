
import {throwError as observableThrowError, of as observableOf, Observable} from 'rxjs';





import {LogEntry} from './log.service';
import {HttpClientHelper, IntputHeader} from '../httpClient.helper';
import {HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';

export interface LogConfig {
  consoleLog?: true,
  apiLog?: false;
  apiURL?: 'NONE';
  localStorageLog?: false
}

// ****************************************************
// Log Publisher Abstract Class
// NOTE: This class must be located BEFORE
//       all those that extend this class
// ****************************************************
export abstract class LogPublisher {
  location: string;

  abstract log(record: LogEntry): Observable<boolean>

  abstract clear(): Observable<boolean>;
}

// ****************************************************
// Console Logging Class
// ****************************************************
export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    // Log to console
    console.log(entry.buildLogString());

    return observableOf(true);
  }

  clear(): Observable<boolean> {
    console.clear();

    return observableOf(true);
  }
}

// ****************************************************
// Local Storage Logging Class
// ****************************************************
export class LogLocalStorage extends LogPublisher {
  constructor() {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = 'logging';
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
    let ret: boolean = false;
    let values: LogEntry[];

    try {
      // Retrieve previous values from local storage
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      // Add new log entry to array
      values.push(entry);
      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));

      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }

    return observableOf(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return observableOf(true);
  }
}

// ****************************************************
// Logging Web API Class
// ****************************************************
export class LogWebApi extends LogPublisher {
  constructor(private httpClientHelper: HttpClientHelper, private url: string) {
    // Must call super() from derived classes
    super();
    // Set location
    this.location = url;
  }

  // **************
  // Public Methods
  // **************

  // Add log entry to back end data store
  log(entry: LogEntry): Observable<boolean> {
    const headers: IntputHeader[] = [{name: 'Content-Type', value: 'application/json'}];

    // any exceptions will be caught by the interceptor
    return this.httpClientHelper.post(this.location, entry, headers).pipe(
      map((res: HttpResponse<any>) => res.body));
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    // TODO: Call Web API to clear all values
    return observableOf(true);
  }

  // ***************
  // Private Methods
  // ***************
  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = '';

    msg = 'Status: ' + error.status;
    msg += ' - Status Text: ' + error.statusText;
    if (error.json()) {
      msg += ' - Exception Message: ' + error.json().exceptionMessage;
    }
    errors.push(msg);

    console.error('An error occurred', errors);

    return observableThrowError(errors);
  }
}
