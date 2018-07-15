import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RpsService } from '../_services/rps-service.service';

@Component({
  selector: 'app-player2',
  templateUrl: './player2.component.html',
})
export class Player2Component implements OnInit {
  move: any = 1;
  stakeInWei: any;
  gameContract: any;
  gameContractAddress: any;
  currentUserAddress: any;
  hasPlayer2Move: boolean = false;
  loadingRefund: boolean = false;
  loadingPlay: boolean = false;

  constructor(private route: ActivatedRoute, private rps_service: RpsService) { }

  ngOnInit() { 
    this.gameContractAddress = this.route.snapshot.paramMap.get('contractAddress');
    this.gameContract = this.rps_service.getGameContract(this.gameContractAddress);
    this.rps_service.getStake().then(stake => {
      this.stakeInWei = stake;
    });
    this.rps_service.getUser().then(user => {
      this.currentUserAddress = user;
      this.gameContract.methods.c2().call({from: this.currentUserAddress}).then(move => {
        if(move != 0){
          this.hasPlayer2Move = true;
        }
      })
    });
  }

  play(){
    this.loadingPlay = true;
    this.rps_service.play(this.stakeInWei, this.move).then(boolean => {
      this.hasPlayer2Move = boolean;
      this.loadingPlay = false;
    }, error => {
      this.loadingPlay = false;
    })
  }

  refund(){
    this.loadingRefund = true;
    this.rps_service.j1Timeout().then(res => {
      this.loadingRefund = false;
    }, error => {
      this.loadingRefund = false;
    });
  }

}
