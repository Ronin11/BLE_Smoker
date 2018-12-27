export const farenheit = "farenheit"
export const farenheitSymbol = "F°" 
export const celsius = "celsius"
export const celsiusSymbol = "C°" 
export const kelvin = "kelvin"
export const kelvinSymbol = "K°"

export const temperatureSymbols = {
	farenheit: farenheitSymbol,
	celsius: celsiusSymbol,
	kelvin: kelvinSymbol
}

export function convertTemp(units, temp){
	switch(units){
		case farenheit:
			return celsiusToFarenheit(temp)
		case celsius:
			return temp
		case kelvin:
			return celsiusToKelvin(temp)
	}
}

export function farenheitToCelsius(temp){
	return Number(((temp - 32) * 5 / 9).toFixed(0))
}

export function celsiusToFarenheit(temp){
	return Number((temp * 9 / 5 + 32).toFixed(0))
}

export function celsiusToKelvin(temp){
	return temp + 273
}

export function kelvinToCelsius(temp){
	return temp - 273
}