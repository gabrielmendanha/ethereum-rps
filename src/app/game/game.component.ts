import { Component, OnInit } from '@angular/core';
import { RpsService } from '../_services/rps-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {
  salt: any;
  gameContract: any;
  move: any;
  gameContractAddress: any;
  timeRemaining: any;
  hasPlayer2Move: boolean = false;
  won: boolean = false;
  gameFinalized: boolean = false;
  loadingRefund: boolean = false;
  loadingReveal: boolean = false;

  constructor(private rps_service: RpsService) { }

  ngOnInit() {
    this.salt = localStorage.getItem("salt");
    this.move = localStorage.getItem("move");
    this.gameContractAddress = localStorage.getItem("contract_address");

    this.gameContract = this.rps_service.getGameContract(this.gameContractAddress);

    this.rps_service.getUser().then(user => {
      var intervalId = setInterval(() => {
        this.gameContract.methods.c2().call({from: user[0]}).then(move => {
          if(move != 0){
            this.hasPlayer2Move = true;
            clearInterval(intervalId);
          }
        });
      }, 5000)
    })
  }

  reveal(){
    this.loadingReveal = true;
    this.rps_service.reveal(this.move, this.salt).then(res => {
      this.won = res;
      this.gameFinalized = true;
      this.loadingReveal = false;
    }, error => {
      this.loadingReveal = false;
    });
  }

  refund(){
    this.loadingRefund = true;
    this.rps_service.j2Timeout().then(res => {
      this.won = false;
      this.gameFinalized = true;
      this.loadingRefund = false;
    }, error => {
      this.loadingRefund = false;
    });
  }



}
