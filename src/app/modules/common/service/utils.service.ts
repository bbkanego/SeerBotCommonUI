import * as ld from "lodash";

export class Utils {
  createDeepCopy(entity) {
    //return JSON.parse(JSON.stringify(entity));
    return ld.cloneDeep(entity);
  }

  filterOnContains(arrayOfObjects:any[], filterProp:string, filterValue:any) {
    return ld.filter(arrayOfObjects, function (item:any) {
      return item[filterProp].indexOf(filterValue) > -1;
    })
  }

  filterOnExactMatch(arrayOfObjects:any[], filterProp:string, filterValue:any) {
    return ld.filter(arrayOfObjects, function (item:any) {
      return item[filterProp] === filterValue;
    })
  }

  sortBy(arrayOfObjects: any[], sortByColumn) {
    return ld.sortBy(arrayOfObjects, sortByColumn);
  }

  removeObject(arrayOfObjects: any[], property:string, value:any) {
    return ld.remove(arrayOfObjects, function(obj){
      return obj[property] !== value;
    })
  }
}
