import { NgModule } from '@angular/core' 
import { IonicPageModule } from 'ionic-angular' 
import { CookPage } from './cook' 

@NgModule({
  declarations: [
    CookPage,
  ],
  imports: [
    IonicPageModule.forChild(CookPage),
  ],
})
export class CookPageModule {}
