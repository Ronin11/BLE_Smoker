import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'graphData',
})
export class GraphDataPipe implements PipeTransform {
  transform(arr, ...args) {
	return arr.map((element) => 
	{
		return {
			...element,
			expanded: false
		}
	}
)
  }
}
