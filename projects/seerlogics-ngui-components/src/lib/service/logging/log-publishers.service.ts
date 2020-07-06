import {Inject, Injectable} from '@angular/core';

import {LogConfig, LogConsole, LogLocalStorage, LogPublisher, LogWebApi} from './log-publishers';
import {HttpClientHelper} from '../httpClient.helper';

// ****************************************************
// Logging Publishers Service Class
// ****************************************************
@Injectable({
  providedIn: 'root'
})
export class LogPublishersService {
  private environment;
  private logConfig: LogConfig = {consoleLog: true};

  constructor(private httpClientHelper: HttpClientHelper, @Inject('environment') environment) {
    this.environment = environment;
    if (environment.logConfig) {
      this.logConfig = environment.logConfig;
    }
    // Build publishers arrays
    this.buildPublishers();
  }

  // Public properties
  publishers: LogPublisher[] = [];

  // *************************
  // Public methods
  // *************************
  // Build publishers array
  buildPublishers(): void {
    if (this.logConfig.consoleLog) {
      // Create instance of LogConsole Class
      this.publishers.push(new LogConsole());
    }

    if (this.logConfig.localStorageLog) {
      // Create instance of LogLocalStorage Class
      this.publishers.push(new LogLocalStorage());
    }

    if (this.logConfig.apiLog && this.logConfig.apiURL) {
      // Create instance of LogWebApi Class
      this.publishers.push(new LogWebApi(this.httpClientHelper, this.logConfig.apiURL));
    }
  }
}
