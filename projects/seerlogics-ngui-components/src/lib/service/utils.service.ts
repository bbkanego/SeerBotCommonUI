import * as ld from 'lodash';
import {COMMON_CONST} from '../model/constants';
import {Injectable} from '@angular/core';

// tree shakable service
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public static getCurrentUser() {
    return localStorage.getItem(COMMON_CONST.CURRENT_USER);
  }

  static createDeepCopy(entity) {
    //return JSON.parse(JSON.stringify(entity));
    return ld.cloneDeep(entity);
  }

  filterOnContains(arrayOfObjects: any[], filterProp: string, filterValue: any) {
    return ld.filter(arrayOfObjects, function (item: any) {
      return item[filterProp].indexOf(filterValue) > -1;
    });
  }

  filterOnExactMatch(arrayOfObjects: any[], filterProp: string, filterValue: any) {
    return ld.filter(arrayOfObjects, function (item: any) {
      return item[filterProp] === filterValue;
    });
  }

  static sortBy(arrayOfObjects: any[], sortByColumn) {
    return ld.sortBy(arrayOfObjects, sortByColumn);
  }

  removeObject(arrayOfObjects: any[], property: string, value: any) {
    return ld.remove(arrayOfObjects, function (obj) {
      return obj[property] !== value;
    });
  }

  /**
   * This example returns a random integer between the specified values.
   * The value is no lower than min (or the next integer greater than min if min
   * isn't an integer), and is less than (but not equal to) max.
   * @param min
   * @param max
   */
  static getRandomIntExclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Getting a random integer between two values, inclusive
   * @param min
   * @param max
   */
  static getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
