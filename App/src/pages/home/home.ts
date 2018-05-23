import { Component } from '@angular/core' 
import { Platform } from 'ionic-angular' 
import { NavController } from 'ionic-angular' 
import { ModalController } from 'ionic-angular' 
import { CookPage } from '../cook/cook' 

import { LoadingController } from 'ionic-angular' 

import { BleProvider } from '../../providers/ble/ble'
import { MetricProvider } from '../../providers/metric/metric'
import { CookProvider } from '../../providers/cook/cook';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BleProvider]
})
export class HomePage {
	maxTemp = 300 
	gaugeBackgroundColor = "#eee" 
	gaugeType = "arch" 
	currentGaugeLabel = "Current Temperature" 
	gaugeLabel = this.currentGaugeLabel


  constructor(
	private ble: BleProvider,
	private cook: CookProvider,
	private metric: MetricProvider, 
	public modalCtrl: ModalController,
	public platform: Platform,
	public loadingCtrl: LoadingController,
	public navCtrl: NavController) {
		this.ble.isPreviousDeviceAvailable().then(savedDevice => {
			this.connect(savedDevice)
		})
	}

	startScan(){
		this.ble.startScan() 
	}

	stopScan(){
		this.ble.stopScan()
	}

	connect = async function(id){
		let loader = this.loadingCtrl.create({
			content: `Connecting...`
		}) 
		loader.present() 
		await this.ble.connect(id) 
		loader.dismiss() 
	}

	gaugeColor(){
		let r = (this.maxTemp - 255 + this.ble.temp).toString(16) 
		let g = '00' 
		let b = (255 - this.ble.temp).toString(16) 
		if(r == '0')
			r = '00'
		if(b == '0')
			b = '00'
		return `#${r}${g}${b}` 
	}

	openCookingDialog(){
		let modal = this.modalCtrl.create(CookPage) 
		modal.present()
	}
}
