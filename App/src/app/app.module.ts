import { BrowserModule } from '@angular/platform-browser' 
import { ErrorHandler, NgModule } from '@angular/core' 

import { SplashScreen } from '@ionic-native/splash-screen' 
import { StatusBar } from '@ionic-native/status-bar' 
import { IonicStorageModule } from '@ionic/storage' 
import { BLE } from '@ionic-native/ble' 
import { HTTP } from '@ionic-native/http'

import { SuperTabsModule } from 'ionic2-super-tabs'

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular' 

import { NgxGaugeModule } from 'ngx-gauge' 

import { MyApp } from './app.component' 
import { HomePage } from '../pages/home/home' 
import { CookPage } from '../pages/cook/cook'
import { GraphPage } from '../pages/graph/graph'
import { ManualPage } from '../pages/manual/manual'
import { ConnectPage } from '../pages/connect/connect'
import { SettingsPage } from '../pages/settings/settings'

import { BleProvider } from '../providers/ble/ble'
import { MetricProvider } from '../providers/metric/metric'
import { SettingsProvider } from '../providers/settings/settings'
import { CommsProvider } from '../providers/comms/comms'


@NgModule({
	declarations: [
		MyApp,
		HomePage,
		ConnectPage,
		CookPage,
		GraphPage,
		SettingsPage,
		ManualPage
	],
	imports: [
		BrowserModule,
		NgxGaugeModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot(),
		SuperTabsModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		ConnectPage,
		CookPage,
		GraphPage,
		SettingsPage,
		ManualPage
	],
	providers: [
		BLE,
		HTTP,
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		BleProvider,
		MetricProvider,
		SettingsProvider,
		CommsProvider
	]
})
export class AppModule {}
