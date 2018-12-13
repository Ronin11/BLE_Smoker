import { Injectable } from '@angular/core'
import { Pipe, PipeTransform } from '@angular/core'
import { templateJitUrl } from '@angular/compiler'

@Injectable()
export class MetricProvider {
	isMetric = false
	standardSymbol = "F°" 
	metricSymbol = "C°" 
	symbol = this.standardSymbol

	constructor() {}

	toggle(){
		this.isMetric = !this.isMetric
		this.symbol = this.isMetric ? this.metricSymbol : this.standardSymbol
	}

	convertTemp(temp){
		if(this.isMetric){
			return temp.toFixed(1)
		}else{
			return ((temp - 32) * 5 / 9).toFixed(0)
		}
	}

	displayTemp(temp){
		if(this.isMetric){
			return temp.toFixed(1)
		}else{
			return (temp * 9 / 5 + 32).toFixed(0)
		}
	}
	celsiusToFarenheit(temp){
		return ((temp - 32) * 5 / 9).toFixed(0)
	}

	farenheitToCelsius(temp){
		return (temp * 9 / 5 + 32).toFixed(0)
	}
}
