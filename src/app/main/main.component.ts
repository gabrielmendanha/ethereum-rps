import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { RpsService } from '../_services/rps-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {

  beginGameForm: FormGroup;
  player2: FormControl;
  value: FormControl;
  move: FormControl;
  salt: any;
  user: any;
  web3: any;
  loading: boolean = false;
  show_success: boolean = false;
  show_error: boolean = false;

  constructor(private rps_service: RpsService, private router: Router, ) { }

  ngOnInit() {
    this.initForm();

    this.rps_service.getUser().then(accounts => {
      this.user = accounts[0];
      this.web3 = this.rps_service.getWeb3Object();
    });
  }

  initForm(){
    this.beginGameForm = new FormGroup({
      player2: new FormControl('', Validators.required),
      value: new FormControl(0, Validators.required),
      move: new FormControl(1, Validators.required)
    })
  }

  // 0x29515e6D1Abd9459450e0c5036e7B34E6D89AcbA

  startGame(){
    if(!this.web3.utils.isAddress(this.beginGameForm.controls.player2.value)){
      this.show_error = true;
      return
    }

    this.beginGameForm.disable();
    let randomString = this.rps_service.calculateRandomString();
    this.rps_service.calculateHash(this.beginGameForm.controls.move.value, randomString).then(hash => {
      this.salt = hash;
      this.loading = true;
      this.rps_service.createGame(hash, this.beginGameForm.controls.player2.value, this.beginGameForm.controls.value.value)
      .then(transaction => {
        if(transaction._address){
          localStorage.setItem("contract_address", transaction._address);
          localStorage.setItem("salt", randomString);
          localStorage.setItem("move", this.beginGameForm.controls.move.value)
          this.loading = false;
          this.show_success = true;
          setTimeout(() => {
            this.router.navigate(['/game/player1/' + transaction._address])
          }, 2000)
        }
      }, error => {
        this.loading = false;
        this.show_error = true;
        this.beginGameForm.enable();
      })
    });
  }
}
