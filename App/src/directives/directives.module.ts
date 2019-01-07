import { NgModule } from '@angular/core'
import { Autosize } from './autosize/autosize'
import { TabIndexDirective } from './tab-index/tab-index';
@NgModule({
	declarations: [Autosize,
    TabIndexDirective,
    TabIndexDirective],
	imports: [],
	exports: [Autosize,
    TabIndexDirective,
    TabIndexDirective]
})
export class DirectivesModule {}
