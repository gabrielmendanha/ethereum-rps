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
  hasPlayer2Move: boolean = false;
  loadingRefund: boolean = false;
  loadingPlay: boolean = false;
  hasTimedOut: boolean = false;
  lastActionTime: any;
  timeout: any;

  constructor(private rps_service: RpsService, private route: ActivatedRoute) { }

  ngOnInit() { 
    this.rps_service.getGameContract(this.route.snapshot.paramMap.get('contractAddress'));

    this.rps_service.getStake().then(stake => {
      this.stakeInWei = stake;
    });

    this.rps_service.getLastAction().then(time => {
      this.lastActionTime = time;
    });

    this.rps_service.getTimeoutTime().then(timeout => {
      this.timeout = timeout;
    });

    let timeoutInterval = setInterval(() => {
      if(this.hasPlayer2Move){
        this.checkTimeout(timeoutInterval);
      }
    }, 5000)

    let intervalId = setInterval(() => {
      this.rps_service.getPlayer2Move().then(move => {
        if(move != 0){
          this.hasPlayer2Move = true;
          clearInterval(intervalId);
        }
      });
    }, 5000)
  }

  checkTimeout(timeoutInterval){
    let timeout = new Date(this.lastActionTime*1000 + this.timeout*1000);
    let now = new Date();
    if(now > timeout && this.hasPlayer2Move){
      this.hasTimedOut = true;
      clearInterval(timeoutInterval);
    }
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
