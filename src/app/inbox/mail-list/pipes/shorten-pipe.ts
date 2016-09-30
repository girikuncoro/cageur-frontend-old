import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ShortenPipe'
})

export class ShortenPipe implements PipeTransform {

  transform(value, args?): string {
    let message = value;
    const maxLength = 50;

    if (message.length < maxLength) {
      return message;
    }
    return message.slice(0, maxLength) + ' ...';
  }
}
