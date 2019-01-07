import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'

import { CommsProvider } from '../../providers/comms/comms'

import { EndCondition } from '../../providers/cook/cook'

import { temperatureSymbols } from '../../helpers/temperature'
import { SettingsProvider } from '../settings/settings';

const dataLengthKey = "dataLength"

@Injectable()
export class DataProvider {

	data = []

	constructor(
		private storage: Storage,
		private settings: SettingsProvider,
		private comms: CommsProvider
		) {
			this.getDataLength().then(length => {
				for(let i = 0; i < length; i++){
					this.storage.get(`data[${i}]`).then((val) => {
						if(val != null){
							this.data = [...this.data ,  JSON.parse(val)]
						}
					})
				}
			})
	}



	createCook(cook){
		let notes = ""
		notes += `\nTarget Temperature: ${cook.targetTemperature} ${temperatureSymbols[this.settings.units]}`
		notes += `\nTemperature Sensor: ${cook.targetTemperatureThermocouple.name}`
		if(cook.endCondition == EndCondition.TIME){
			notes += `\n~~~~ Time Based End Condition ~~~~`
			notes += `\nEnd Time: ${cook.endTime}`
		}else if(cook.endCondition == EndCondition.TEMPERATURE){
			notes += `\n~~~~ Temperature Based End Condition ~~~~`
			notes += `\nTarget Temperature: ${cook.endConditionTargetTemperature} ${temperatureSymbols[this.settings.units]}`
			notes += `\nTemperature Sensor: ${cook.endConditionThermocouple.name}`
		}
		const today = new Date()
		const newCook = {
			id: this.data.length,
			name: cook.name,
			date: `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`,
			labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00"],
			notes: notes,
			data: [
				{
					name: "Thermocouple 1",
					values: [65, 59, 80, 81, 56, 55, 40],
					color: "rgb(255,0,0)"
				},
				{
					name: "Thermocouple 2",
					values: [120, 80, 90, 110, 60, 70, 85],
					color: "rgb(0,255,0)"
				},
				{
					name: "Thermocouple 4",
					values: [15, 29, 30, 21, 16, 45, 20],
					color: "rgb(255,0,0)"
				},
				{
					name: "Thermocouple 5",
					values: [120, 180, 190, 180, 160, 170, 185],
					color: "rgb(0,255,0)"
				},
				{
					name: "Thermocouple 6",
					values: [180, 185, 140, 150, 215, 182, 99],
					color: "rgb(0,0,255)"
				}
			]
		}

		this.data = [...this.data ,  newCook]
		this.updateDatum(newCook.id)
	}

	updateDatum(id){
		// this.dataSubject.next(id)
		this.storage.set(`data[${id}]`, JSON.stringify(this.data[id]))
		this.storage.set(dataLengthKey, this.data.length)
	}

	async getDataLength(){
		return await this.storage.get(dataLengthKey)
	}

}
