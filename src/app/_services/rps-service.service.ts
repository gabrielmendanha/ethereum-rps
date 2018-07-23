import { Injectable } from '@angular/core';
import { contractAbi, hasherContractAddress, hasherAbi, gameContractBytecode } from '../_utils/utils.constants'
import Web3 from 'web3';

@Injectable()
export class RpsService {

  private web3: any;
  private gameContractAddress: any;
  private gameContract: any;
  private hasherContract: any;
  private defaultUserAccount: any;

  constructor() { 
    if (typeof window['web3'] !== 'undefined') {

      this.web3 = new Web3(window['web3'].currentProvider);
      this.hasherContract = new this.web3.eth.Contract(hasherAbi,  hasherContractAddress);
      this.getUser();
    }
  }

  getGameContract(gameContractAddress){
    if(this.gameContract){
      this.gameContract.options.address = gameContractAddress;
      return this.gameContract;
    }
    else 
      return this.gameContract = new this.web3.eth.Contract(contractAbi, gameContractAddress);
  }

  getUser() {
    if(this.defaultUserAccount)
      return new Promise((resolve, reject) => {
        resolve(this.defaultUserAccount);
      });
    else
      return new Promise((resolve, reject) => {
        return this.web3.eth.getAccounts((error, accounts) => {
          this.defaultUserAccount = accounts[0];
          resolve(this.defaultUserAccount);
        });
      })
  }

  getWeb3Object(){
    return this.web3;
  }

  createGame(hash, player2, value) {
    value = this.web3.utils.toWei(value.toString());
    var contract = new this.web3.eth.Contract(contractAbi, {from: this.defaultUserAccount});
    return contract.deploy({
      data: gameContractBytecode,
      arguments: [hash, player2]})
      .send({
        from: this.defaultUserAccount,
        value: value,
        gas: 1500000,
        gasPrice: '10000000000'
      }, (error, transaction) => {
        if(error)
          return error
        this.gameContractAddress = transaction._address;
        this.gameContract = new this.web3.eth.Contract(contractAbi,  this.gameContractAddress);
        return transaction;
      });
  }

  calculateRandomString(){
    return this.web3.utils.randomHex(32);
  }

  calculateHash(move, salt) {
    return this.hasherContract.methods.hash(move, salt).call();
  }

  reveal(move, salt){
    return this.gameContract.methods.solve(move, salt).send({from: this.defaultUserAccount, gas: 1500000, gasPrice: '10000000000'});
  }

  j1Timeout(){
    return this.gameContract.methods.j1Timeout().send({from: this.defaultUserAccount, gas: 1500000, gasPrice: '10000000000'});
  }

  j2Timeout(){
    return this.gameContract.methods.j2Timeout().send({from: this.defaultUserAccount, gas: 1500000, gasPrice: '10000000000'});
  }

  getStake(){
    return this.gameContract.methods.stake().call();
  }

  getPlayer2Move(){
    return this.gameContract.methods.c2().call();
  }

  getLastAction(){
    return this.gameContract.methods.lastAction().call();
  }

  getTimeoutTime(){
    return this.gameContract.methods.TIMEOUT().call();
  }

  play(stake, move){
    return this.gameContract.methods.play(move).send({
      from: this.defaultUserAccount,
      value: stake,
      gas: 1500000,
      gasPrice: '10000000000'},
      (error, transaction) => {
        if(error){
          return false
        }
        return true;
      });
  }
}
