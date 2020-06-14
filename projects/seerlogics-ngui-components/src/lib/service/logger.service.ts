import {Injectable} from '@angular/core';

// tree shakable service
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {
  }

  logDebug(logMessage) {
    console.log(logMessage);
  }
}
