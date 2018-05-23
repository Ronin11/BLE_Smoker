import { BrowserModule } from '@angular/platform-browser' 
import { ErrorHandler, NgModule } from '@angular/core' 

import { SplashScreen } from '@ionic-native/splash-screen' 
import { StatusBar } from '@ionic-native/status-bar' 
import { IonicStorageModule } from '@ionic/storage' 
import { BLE } from '@ionic-native/ble' 

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular' 

import { NgxGaugeModule } from 'ngx-gauge' 

import { MyApp } from './app.component' 
import { HomePage } from '../pages/home/home' 
import { CookPage } from '../pages/cook/cook' 
import { BleProvider } from '../providers/ble/ble'
import { MetricProvider } from '../providers/metric/metric';
import { CookProvider } from '../providers/cook/cook'; 

@NgModule({
  declarations: [
    MyApp,
	HomePage,
	CookPage
  ],
  imports: [
	BrowserModule,
	NgxGaugeModule,
	IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
	HomePage,
	CookPage
  ],
  providers: [
	BLE,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BleProvider,
    MetricProvider,
    CookProvider
  ]
})
export class AppModule {}
