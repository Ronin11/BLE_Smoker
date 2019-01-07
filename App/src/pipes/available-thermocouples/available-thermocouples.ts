import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'availableThermocouples'
})
export class AvailableThermocouplesPipe implements PipeTransform {

	transform(thermocouples, ...args) {
		return thermocouples.filter(thermocouple => {
			// return thermocouple.active && !thermocouple.selected
			return thermocouple.active
		})
	}
}
