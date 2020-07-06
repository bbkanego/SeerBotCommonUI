import {Inject, Injectable} from '@angular/core';

import { LogPublishersService } from "./log-publishers.service";
import { LogPublisher } from "./log-publishers";

// ****************************************************
// Log Level Enumeration
// ****************************************************
export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

/**
 * Logging Entry class:
 * https://www.codemag.com/Article/1711021/Logging-in-Angular-Applications
 * https://www.pdsa.com/downloads
 */
export class LogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message: string = "";
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate: boolean = true;

  // **************
  // Public Methods
  // **************
  buildLogString(): string {
    let value:string = "";

    if (this.logWithDate) {
      value = new Date() + " - ";
    }
    value += "Type: " + LogLevel[this.level];
    value += " - Message: " + this.message;
    if (this.extraInfo.length) {
      value += " - Extra Info: "
        + this.formatParams(this.extraInfo);
    }

    return value;
  }

  // ***************
  // Private Methods
  // ***************
  private formatParams(params: any[]): string {
    let ret:string = params.join(",");

    // Is there at least one object in the array?
    if (params.some(p => typeof p == "object")) {
      ret = "";
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }

    return ret;
  }
}

// ****************************************************
// Log Service Class
// ****************************************************
@Injectable({
  providedIn: 'root'
})
export class LogService {
  private environment;
  constructor(private publishersService: LogPublishersService, @Inject('environment') environment) {
    this.environment = environment;
    // Set publishers
    this.publishers = this.publishersService.publishers;
  }

  // Public Properties
  publishers: LogPublisher[];
  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  // *************************
  // Public methods
  // *************************
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  clear(): void {
    for (let logger of this.publishers) {
      logger.clear()
        .subscribe(response => console.log(response));
    }
  }

  // *************************
  // Private methods
  // *************************
  private shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;

    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }

    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      // Declare variables
      let entry: LogEntry = new LogEntry();

      // Build Log Entry
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logger of this.publishers) {
        logger.log(entry)
          .subscribe(response => console.log(response));
      }
    }
  }
}
