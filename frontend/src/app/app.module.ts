import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        ClarityModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule
    ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
