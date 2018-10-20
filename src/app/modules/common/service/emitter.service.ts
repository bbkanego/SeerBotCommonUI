// https://gist.github.com/sasxa
// Imports
import {Injectable, EventEmitter} from '@angular/core';

/**
 * Assume that you have multiple components which are siblings or cousins and you want to communicate
 * between each of these components. This is achieved through and event bus design pattern.
 *
 * Each of the component who wants to subscribe to events will implment "OnChanges" interface and the
 * "ngOnChanges" method. And using the EmitterService, will "subscribe" to certain events. The "eventName"
 *
 * All this does is register events in an _emitters object and emits them when they are called using
 * the get() method.
 */

@Injectable()
export class EmitterService {
  // Event store
  private static _emitters:{ [eventName: string]: EventEmitter<any> } = {};
  // Set a new event in the store with a given eventName as key
  static get(eventName:string):EventEmitter<any> {
    if (!this._emitters[eventName]) {
      this._emitters[eventName] = new EventEmitter();
    }
    return this._emitters[eventName];
  }
}
