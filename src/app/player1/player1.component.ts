import { Component, OnInit } from '@angular/core';
import { RpsService } from '../_services/rps-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player1',
  templateUrl: './player1.component.html',
})
export class Player1Component implements OnInit {
  salt: any;
  gameContract: any;
  move: any;
  gameContractAddress: any;
  baseUrl: any;
  completeUrl: any;
  won: boolean = false;
  hasTimedOut: boolean = false;
  hasPlayer2Move: boolean = false;
  gameFinalized: boolean = false;
  loadingRefund: boolean = false;
  loadingReveal: boolean = false;
  lastActionTime: any;
  timeout: any;


  constructor(private rps_service: RpsService, private router: Router) { 

  }

  ngOnInit() {
    this.salt = localStorage.getItem("salt");
    this.move = localStorage.getItem("move");
    this.gameContractAddress = localStorage.getItem("contract_address");

    this.baseUrl = window.location.origin;
    this.completeUrl = this.baseUrl + "/game/player2/" + this.gameContractAddress;

    this.gameContract = this.rps_service.getGameContract(this.gameContractAddress);

    this.rps_service.getLastAction().then(time => {
      this.lastActionTime = time;
    });

    this.rps_service.getTimeoutTime().then(timeout => {
      this.timeout = timeout;
    });

    var intervalId = setInterval(() => {
      this.rps_service.getPlayer2Move().then(move => {
        if(move == 0){
          this.checkTimeout();
        } else {
          this.hasPlayer2Move = true;
          this.hasTimedOut = false;
          clearInterval(intervalId);
        }
      });
    }, 5000)
  }
  // 0x29515e6D1Abd9459450e0c5036e7B34E6D89AcbA
  checkTimeout(){
    let timeout = new Date(this.lastActionTime*1000 + this.timeout*1000);
    let now = new Date();
    if(now > timeout && !this.hasPlayer2Move){
      this.hasTimedOut = true;
    }
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
