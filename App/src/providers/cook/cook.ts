import { Injectable } from '@angular/core'

// import { CommsProvider } from '../comms/comms'
import { SettingsProvider } from '../settings/settings'
import { NotificationProvider } from '../notification/notification'

import { currentTimeInSeconds } from '../../helpers/time'
import { convertToCelsius } from '../../helpers/temperature'

export enum EndCondition {
	TIME,
	TEMPERATURE
}

export const EndConditions = [
	{
		name: "Time",
		value: EndCondition.TIME
	},
	{
		name: "Target Temperature",
		value: EndCondition.TEMPERATURE
	}
]

export enum CookStatus {
	PAUSED,
	RUNNING,
	STOPPED,
	FINISHED
}

function isEquivalent(a, b) {
	if( a && b){
		var aProps = Object.getOwnPropertyNames(a)
		var bProps = Object.getOwnPropertyNames(b)

		if (aProps.length != bProps.length) {
			return false
		}
	
		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i]
			if (a[propName] !== b[propName]) {
				return false
			}
		}
		return true
	}
	return false
}

const today = new Date()

@Injectable()
export class CookProvider {
	cook = {
		name: {
			value: `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`,
			validated: null,
			validationError: null
		},
		startTime: {
			value: null,
			validated: null,
			validationError: null
		},
		targetTemperature: {
			displayValue: null,
			value: null,
			validated: null,
			validationError: null
		},
		targetTemperatureThermocouple: {
			value: null,
			validated: null,
			validationError: null
		},
		endCondition: {
			value: null,
			validated: null,
			validationError: null
		} ,
		endConditionThermocouple: {
			value: null,
			validated: null,
			validationError: null
		},
		endConditionTargetTemperature: {
			displayValue: null,
			value: null,
			validated: null,
			validationError: null
		},
		endTime: {
			value: null,
			validated: null,
			validationError: null
		},
		validated: false,
		updateValidated: false
	}
	runningCook 
	
	cookStatus: CookStatus
	autoResumeTimer
	autoResumeTimeLeft
	estimatedTimeLeft
	estimatedTimeLeftTimer

	constructor(
		private settings: SettingsProvider,
		private notificationProvider: NotificationProvider
		// private comms: CommsProvider
		) {
		this.cookStatus = CookStatus.STOPPED
		notificationProvider.sendNotification('TITEL', 'PENIS')
		
	}

	getCookStatusFromDevice(){
		
	}

	startCook(){
		this.cookStatus = CookStatus.RUNNING
		this.runningCook = Object.assign({}, this.cook)
		// this.startTimeLeftTimer()
	}

	pauseCook(){
		this.cookStatus = CookStatus.PAUSED
		this.startAutoResumeTimer()
	}

	resumeCook(){
		this.cookStatus = CookStatus.RUNNING
		this.autoResumeTimeLeft = null
		clearTimeout(this.autoResumeTimer)
	}

	stopCook(){
		this.cookStatus = CookStatus.STOPPED
		clearTimeout(this.autoResumeTimer)
	}

	validateCook(){
		if(this.cook.name.value){
			if(this.cook.name.value.length <= 32){
				this.cook.name.validated = true
			}else{
				this.cook.name.validated = false
				this.cook.name.validationError = "Max length is 32 characters"
			}
		}
		if(this.cook.startTime.value){

		}
		if(this.cook.targetTemperature.displayValue){
			this.cook.targetTemperature.value = convertToCelsius(this.settings.units, this.cook.targetTemperature.displayValue)
			const maxTemp = 265
			const minTemp = 37
			const targetTemp = this.cook.targetTemperature.value
			if(targetTemp > minTemp && targetTemp < maxTemp ){
				this.cook.targetTemperature.validated = true
			}else{
				this.cook.targetTemperature.validated = false
				if(targetTemp < minTemp){
					this.cook.targetTemperature.validationError = "Target temp is below minimum temperature"
				}else if(targetTemp > maxTemp){
					this.cook.targetTemperature.validationError = "Target temp is above maximum temperature"
				}
			}
		}

		if(this.cook.endConditionTargetTemperature.displayValue){
			this.cook.endConditionTargetTemperature.value = convertToCelsius(this.settings.units, this.cook.endConditionTargetTemperature.displayValue)
			const maxTemp = 265
			const minTemp = 37
			const targetTemp = this.cook.endConditionTargetTemperature.value
			if(targetTemp > minTemp && targetTemp < maxTemp ){
				this.cook.endConditionTargetTemperature.validated = true
			}else{
				this.cook.endConditionTargetTemperature.validated = false
				if(targetTemp < minTemp){
					this.cook.endConditionTargetTemperature.validationError = "Target temp is below minimum temperature"
				}else if(targetTemp > maxTemp){
					this.cook.endConditionTargetTemperature.validationError = "Target temp is above maximum temperature"
				}
			}
		}

		this.cook.targetTemperatureThermocouple.value ? 
			this.cook.targetTemperatureThermocouple.validated = true : 
			this.cook.targetTemperatureThermocouple.validated = false
		this.cook.endConditionThermocouple.value ? 
			this.cook.endConditionThermocouple.validated = true : 
			this.cook.endConditionThermocouple.validated = false
		if(this.cook.targetTemperatureThermocouple.value && this.cook.endConditionThermocouple.value){
			if(this.cook.targetTemperatureThermocouple.value == this.cook.endConditionThermocouple.value){
				this.cook.endConditionThermocouple.validationError = "Cannot use the same sensor"
				this.cook.endConditionThermocouple.validated = false
			}
			
		}
		if(this.cook.endTime.value){
			this.cook.endTime.value ? this.cook.endTime.validated = true : this.cook.endTime.validated = false
		}

		if(
			this.cook.targetTemperature.validated && 
			this.cook.targetTemperatureThermocouple.validated &&
			((this.cook.endCondition.value == EndCondition.TEMPERATURE && 
				this.cook.endConditionTargetTemperature.validated &&
				this.cook.endConditionThermocouple.validated) || (
				this.cook.endCondition.value == EndCondition.TIME && 
				this.cook.endTime.validated))
		){
			this.cook.validated = true
		}else{
			this.cook.validated = false
		}

		if(isEquivalent(this.cook, this.runningCook) && this.cook.validated){
			this.cook.updateValidated = true
		}else{
			this.cook.updateValidated = false
		}
	}

	startAutoResumeTimer(){
		if(this.settings.autoResumeTimer != "null"){
			let time = parseInt(this.settings.autoResumeTimer)

			const startTimer = () => {
				this.autoResumeTimer = setTimeout(() => 
				{
					if(time <= 0) { 
						this.resumeCook()
						return
					}
					time -= 1
					this.autoResumeTimeLeft = time
					startTimer()
		 
				}, 1000)
			}
			startTimer()
		}
	}

	// startTimeLeftTimer(){
	// 	if(this.cook.endTime){
	// 		let time = this.cook.endTime - currentTimeInSeconds()

	// 		const startTimer = () => {
	// 			this.estimatedTimeLeftTimer = setTimeout(() => 
	// 			{
	// 				if(time <= 0) { 
	// 					this.cookStatus = CookStatus.FINISHED
	// 					return
	// 				}
	// 				time -= 1
	// 				this.estimatedTimeLeft = time
	// 				startTimer()
		 
	// 			}, 1000)
	// 		}
	// 		startTimer()
	// 	}
	// }

}
