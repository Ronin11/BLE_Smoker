import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'

import { LoadingController } from 'ionic-angular' 

import { SettingsProvider } from '../../providers/settings/settings'

import { 
	convertTemp,
	temperatureSymbols
} from '../../helpers/temperature'
import { CommsProvider } from '../../providers/comms/comms'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	maxTemp = 300 
	gaugeBackgroundColor = "#eee" 
	gaugeType = "arch" 
	currentGaugeLabel = "Current Temperature" 
	gaugeLabel = this.currentGaugeLabel
	color = "#FF0000"

	temperatureSymbols = temperatureSymbols
	convertTemp = convertTemp


	constructor(
		private comms: CommsProvider,
		private settings: SettingsProvider,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController
	) {}

	func(temp){
		return temp
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
