import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'

import { CommsProvider } from '../comms/comms'


@Injectable()
export class SettingsProvider {
	thermocouples = [
		{
			id: 0,
			name: "Sensor 1",
			designation: "Sensor #1",
			active: true,
			value: 0
		},
		{
			id: 1,
			name: "Sensor 2",
			designation: "Sensor #2",
			active: true,
			value: 0
		},
		{
			id: 2,
			name: "Sensor 3",
			designation: "Sensor #3",
			active: false,
			value: 0
		},
		{
			id: 3,
			name: "Sensor 4",
			designation: "Sensor #4",
			active: true,
			value: 0
		},
		{
			id: 4,
			name: "Sensor 5",
			designation: "Sensor #5",
			active: false,
			value: 0
		},
		{
			id: 5,
			name: "Sensor 6",
			designation: "Sensor #6",
			active: false,
			value: 0
		}
	]
	units = "farenheit"
	// functionality = {
	// 	canStart: true
	// }

	autoResumeTimer = "300"

	constructor(
		private storage: Storage,
		private comms: CommsProvider) {
			this.getSettingFromStorage('thermocouples')
			this.getSettingFromStorage('units')
			this.getSettingFromStorage('autoResumeTimer')

			comms.temperatureSubject.subscribe(data => {
				this.updateTemperatures(data)
			})
		}

	updateTemperatures(data){
		for(let id in data){
			this.thermocouples[id].value = data[id]
		}
	}

	updateStorage(key, value){
		this.storage.set(key, value)
	}

	getSettingFromStorage(key){
		this.storage.get(key).then((val) => {
			if(val != null){
				this[key] = val
			}
		})
	}

}
