import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CyranoTutorialComponent } from './cyrano-tutorial.component';
import { WalkthroughModule } from 'angular-walkthrough';
import { ButtonsModule } from 'nextsapien-component-lib';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    CyranoTutorialComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WalkthroughModule,
    HttpClientModule,
    ButtonsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CyranoTutorialComponent
  ]
})
export class CyranoTutorialModule { }
