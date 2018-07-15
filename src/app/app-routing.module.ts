import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Player1Component } from './player1/player1.component';
import { Player2Component } from './player2/player2.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'game/player1/:contractAddress', component: Player1Component },
  { path: 'game/player2/:contractAddress', component: Player2Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
