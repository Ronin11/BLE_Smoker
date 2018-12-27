import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CookSummaryPage } from './cook-summary';

@NgModule({
  declarations: [
    CookSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(CookSummaryPage),
  ],
})
export class CookSummaryPageModule {}
