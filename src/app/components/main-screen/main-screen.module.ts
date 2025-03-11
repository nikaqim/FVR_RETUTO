import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ButtonsModule } from 'nextsapien-component-lib';

import { MainScreenComponent } from './main-screen.component';
import { TutoWalkthroughModule } from '../tuto-walkthrough/tuto-walkthrough.module';

@NgModule({
  declarations: [MainScreenComponent],
  imports: [
    CommonModule,
    SharedModule,
    ButtonsModule,
    TutoWalkthroughModule
  ], 
  bootstrap: [MainScreenComponent]
})
export class MainScreenModule { }
