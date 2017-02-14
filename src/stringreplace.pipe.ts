import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringreplace'
})
export class StringreplacePipe implements PipeTransform {

  transform(value: any, replaceVal: any): any {
    if(!value) return null;
    return value.replace('%s', replaceVal);
  }

}
