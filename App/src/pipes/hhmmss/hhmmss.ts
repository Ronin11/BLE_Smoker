import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hhmmss',
})
export class HhmmssPipe implements PipeTransform {

  transform(value: string, ...args) {
	const s = parseInt(value)
	const hours = ((s - s % 3600) / 3600) % 60
	const minutes = ((s - s % 60) / 60) % 60
	const seconds = s % 60
	let returnString = ''
	if(hours) returnString += `${hours}:`
	if(minutes) returnString += `${minutes}:`
	return `${returnString}${seconds}`
  }
}
