import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { BleProvider } from '../../providers/ble/ble';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BleProvider]
})
export class HomePage {
	temp = 0;

  constructor(
	private ble: BleProvider, 
	public platform: Platform,
	public loadingCtrl: LoadingController,
	public navCtrl: NavController) {
	}

	startScan(){
		this.ble.startScan();
	}

	stopScan(){
		this.ble.stopScan()
	}

	connect = async function(id){
		let loader = this.loadingCtrl.create({
			content: `Connecting...`
		});
		loader.present();
		await this.ble.connect(id);
		loader.dismiss();
	}

	getTemp = async function(){
		this.temp = await this.ble.getTemp();
	}

}
