import { Component, ViewChild } from '@angular/core'
import { Platform } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { MenuController } from 'ionic-angular'
import { ModalController } from 'ionic-angular'
import { Nav } from 'ionic-angular'

import { HomePage } from '../pages/home/home'
import { CookPage } from '../pages/cook/cook'
import { ManualPage } from '../pages/manual/manual'
import { BleProvider } from '../providers/ble/ble'
import { MetricProvider } from '../providers/metric/metric'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage:any = HomePage 

	constructor(
		private metric: MetricProvider,
		private ble: BleProvider,
		public menuCtrl: MenuController,
		public modalCtrl: ModalController, 
		platform: Platform, 
		statusBar: StatusBar, 
		splashScreen: SplashScreen) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault() 
			splashScreen.hide() 
		}) 
	}

	openMenu() {
		this.menuCtrl.open()
	}

	closeMenu() {
		this.menuCtrl.close()
	}

	openCookingModal(){
		let modal = this.modalCtrl.create(CookPage) 
		modal.present() 
	}

	navigateToManualPage(){
		this.nav.push(ManualPage)
		this.closeMenu()
	}

	removeSavedDevice(){
		this.ble.removeSavedDevice()
		this.closeMenu()
	}

	toggleMetric(){
		this.metric.toggle()
		this.closeMenu()
	}
}

