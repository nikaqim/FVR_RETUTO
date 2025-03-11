import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutoWalkthroughComponent } from './tuto-walkthrough.component';
// import { MyWalkthroughComponent } from './my-walkthrough/my-walkthrough.component';
import { SharedModule } from '../shared/shared.module';
import { WalkthroughModule } from 'angular-walkthrough';

@NgModule({
  declarations: [
    TutoWalkthroughComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    TutoWalkthroughComponent,
  ]
})
export class TutoWalkthroughModule { }
