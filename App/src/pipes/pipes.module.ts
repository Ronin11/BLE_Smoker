import { NgModule } from '@angular/core';
import { HhmmssPipe } from './hhmmss/hhmmss';
import { AvailableThermocouplesPipe } from './available-thermocouples/available-thermocouples';
import { GraphDataPipe } from './graph-data/graph-data';
@NgModule({
	declarations: [HhmmssPipe,
    AvailableThermocouplesPipe,
    GraphDataPipe],
	imports: [],
	exports: [HhmmssPipe,
    AvailableThermocouplesPipe,
    GraphDataPipe]
})
export class PipesModule {}
