import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BleProvider } from '../../providers/ble/ble';

/**
 * Generated class for the ManualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manual',
  templateUrl: 'manual.html',
})
export class ManualPage {
	fanSpeed: Number

	constructor(
		private ble: BleProvider,
		public navCtrl: NavController, 
		public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ManualPage');
	}

	setFanSpeed(){
		this.ble.writeFanSpeed(this.fanSpeed)
	}

}
