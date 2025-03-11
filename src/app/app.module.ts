import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './components/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainScreenModule } from './components/main-screen/main-screen.module';
import { TutoWalkthroughModule } from './components/tuto-walkthrough/tuto-walkthrough.module';
import { StartScreenModule } from './components/start-screen/start-screen.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    StartScreenModule,
    MainScreenModule,
    TutoWalkthroughModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
