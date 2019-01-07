import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoteEditPage } from './note-edit';

@NgModule({
  declarations: [
    NoteEditPage,
  ],
  imports: [
    IonicPageModule.forChild(NoteEditPage),
  ],
})
export class NoteEditPageModule {}
