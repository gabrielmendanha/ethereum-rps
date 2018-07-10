import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { RpsService } from '../_services/rps-service.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private rps_service: RpsService) { }

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
      move: new FormControl(0, Validators.required)
    })
  }

  // 0x29515e6D1Abd9459450e0c5036e7B34E6D89AcbA

  startGame(){
    this.beginGameForm.disable();
    let randomString = this.rps_service.calculateRandomString();
    this.rps_service.calculateHash(this.beginGameForm.controls.move.value, randomString).then(hash => {
      this.salt = hash;
      this.loading = true;
      this.rps_service.createGame(hash, this.beginGameForm.controls.player2.value, this.beginGameForm.controls.value.value)
      .then(transaction => {
        if(transaction._address){
          //  TODO Add transaction hash to local storage
          localStorage.setItem("contract_address", transaction._address);
          this.loading = false;
          this.show_success = true;
        }
      }, error => {
        this.loading = false;
        this.show_error = true;
        this.beginGameForm.enable();
      })
    });
  }
}
