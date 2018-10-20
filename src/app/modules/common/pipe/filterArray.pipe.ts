import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'bkFilterArray'
})
export class FilterArrayPipe implements PipeTransform {
  transform(value:any[], filterProp: string = null, filterString: string = null, exactMatch:boolean = false):any {
    if (!value || value.length == 0 || !filterString || !filterProp) return value;

    const returnArray = [];
    for (let item of value) {
      if (!exactMatch) {
        if (item[filterProp].contains(filterString)) {
          returnArray.push(item);
        }
      } else {
        if (item[filterProp] === filterString) {
          returnArray.push(item);
        }
      }
    }
    return returnArray;
  }
}
