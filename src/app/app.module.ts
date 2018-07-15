import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RpsService } from './_services/rps-service.service';
import { Player1Component } from './player1/player1.component';
import { Player2Component } from './player2/player2.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    Player1Component,
    Player2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [RpsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
