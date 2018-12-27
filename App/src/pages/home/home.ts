import { Component, ViewChild } from '@angular/core'

import { 
	NavController, 
	LoadingController, 
	Events 
} from 'ionic-angular' 

import { CookPage } from '../cook/cook'
import { SettingsProvider } from '../../providers/settings/settings'
import { TemperatureProvider } from '../../providers/temperature/temperature'
import { CookProvider, CookStatus } from '../../providers/cook/cook'

import { 
	convertTemp,
	temperatureSymbols
} from '../../helpers/temperature'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	gaugeBackgroundColor = "#eee" 
	gaugeType = "arch" 
	currentGaugeLabel = "Current Temperature" 
	gaugeLabel = this.currentGaugeLabel
	color = "#FF0000"

	//Done to bring into scope for the markup
	temperatureSymbols = temperatureSymbols
	convertTemp = convertTemp
	CookStatus = CookStatus

	constructor(
		private cookProvider: CookProvider,
		private temperatureProvider: TemperatureProvider,
		private settings: SettingsProvider,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		public events: Events
	) {}

	navigateToCook(){
		this.events.publish('nav:swipeTo', CookPage);
	}

	// gaugeColor(){
	// 	let r = (this.maxTemp - 255 + this.ble.temp).toString(16) 
	// 	let g = '00' 
	// 	let b = (255 - this.ble.temp).toString(16) 
	// 	if(r == '0')
	// 		r = '00'
	// 	if(b == '0')
	// 		b = '00'
	// 	return `#${r}${g}${b}` 
	// }
}
