import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable()
export class RpsService {

  private contractAbi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "_c1",
          "type": "uint8"
        },
        {
          "name": "_c2",
          "type": "uint8"
        }
      ],
      "name": "win",
      "outputs": [
        {
          "name": "w",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "j2Timeout",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "stake",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "c2",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "c1Hash",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_c2",
          "type": "uint8"
        }
      ],
      "name": "play",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "j2",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "lastAction",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_c1",
          "type": "uint8"
        },
        {
          "name": "_salt",
          "type": "uint256"
        }
      ],
      "name": "solve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "j1",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "j1Timeout",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "TIMEOUT",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_c1Hash",
          "type": "bytes32"
        },
        {
          "name": "_j2",
          "type": "address"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "constructor"
    }
  ]
  private hasherAbi = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "_c",
          "type": "uint8"
        },
        {
          "name": "_salt",
          "type": "uint256"
        }
      ],
      "name": "hash",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
  private web3: any;
  private gameContractAddress: any;
  private gameContract: any;
  private hasherContractAddress = "0x1c9D63870489DaE62f9D5469Cb2456925c5d72F3";
  private hasherContract: any;
  private defaultUserAccount: any;

  constructor() { 
    if (typeof window['web3'] !== 'undefined') {

      this.web3 = new Web3(window['web3'].currentProvider);
      this.hasherContract = new this.web3.eth.Contract(this.hasherAbi,  this.hasherContractAddress);
    }
  }

  //0x29515e6D1Abd9459450e0c5036e7B34E6D89AcbA

  getGameContract(gameContractAddress){
    if(this.gameContract)
      return this.gameContract
    else 
      return this.gameContract = new this.web3.eth.Contract(this.contractAbi, gameContractAddress);
  }

  getUser() {
    if(this.defaultUserAccount)
      return this.defaultUserAccount;
    else
      return this.web3.eth.getAccounts((error, accounts) => {
        this.defaultUserAccount = accounts[0];
        return this.defaultUserAccount;
      });
  }

  getTransactionReceiptMined(txHash, interval) {
    const transactionReceiptAsync = function(resolve, reject) {
        this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => this.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};

  getWeb3Object(){
    return this.web3;
  }

  checkProvider(): boolean {
    if(typeof window['web3'] !== 'undefined')
      return true
    else
      return false
  }

  checkNetwork(): boolean {
    return this.web3.eth.net.getNetworkType().then(network => {
      if(network !== "ropsten")
        return false
      else
        return true
    });
  }

  createGame(hash, player2, value) {
    value = this.web3.utils.toWei(value.toString());
    var contract = new this.web3.eth.Contract(this.contractAbi, {from: this.defaultUserAccount});
    return contract.deploy({
      data: "0x6080604081815261012c600555806106788339810160405280516020909101513460045560008054600160a060020a0319908116331790915560018054600160a060020a039093169290911691909117905560025542600655610611806100676000396000f3006080604052600436106100b95763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630c4395b981146100be578063294914a4146100f35780633a4b66f11461010a57806348e257cb146101315780634d03e3d21461016a57806353a04b051461017f57806380985af91461018d57806389f71d53146101be578063a5ddec7c146101d3578063c37597c6146101f1578063c839114214610206578063f56f48f21461021b575b600080fd5b3480156100ca57600080fd5b506100df60ff60043581169060243516610230565b604080519115158252519081900360200190f35b3480156100ff57600080fd5b506101086102ec565b005b34801561011657600080fd5b5061011f61034c565b60408051918252519081900360200190f35b34801561013d57600080fd5b50610146610352565b6040518082600581111561015657fe5b60ff16815260200191505060405180910390f35b34801561017657600080fd5b5061011f61035b565b61010860ff60043516610361565b34801561019957600080fd5b506101a26103c8565b60408051600160a060020a039092168252519081900360200190f35b3480156101ca57600080fd5b5061011f6103d7565b3480156101df57600080fd5b5061010860ff600435166024356103dd565b3480156101fd57600080fd5b506101a261056a565b34801561021257600080fd5b50610108610579565b34801561022757600080fd5b5061011f6105df565b600081600581111561023e57fe5b83600581111561024a57fe5b1415610258575060006102e6565b600083600581111561026657fe5b1415610274575060006102e6565b600282600581111561028257fe5b81151561028b57fe5b06600284600581111561029a57fe5b8115156102a357fe5b0614156102ca578160058111156102b657fe5b8360058111156102c257fe5b1090506102e6565b8160058111156102d657fe5b8360058111156102e257fe5b1190505b92915050565b600060035460ff1660058111156102ff57fe5b1461030957600080fd5b60055460065401421161031b57600080fd5b60008054600454604051600160a060020a039092169281156108fc029290818181858888f150506000600455505050565b60045481565b60035460ff1681565b60025481565b600060035460ff16600581111561037457fe5b1461037e57600080fd5b600454341461038c57600080fd5b600154600160a060020a031633146103a357600080fd5b6003805482919060ff191660018360058111156103bc57fe5b02179055505042600655565b600154600160a060020a031681565b60065481565b600060035460ff1660058111156103f057fe5b14156103fb57600080fd5b600054600160a060020a0316331461041257600080fd5b600254604051839083908083600581111561042957fe5b60ff167f01000000000000000000000000000000000000000000000000000000000000000281526001018281526020019250505060405180910390206000191614151561047557600080fd5b60035461048690839060ff16610230565b156104c15760008054600454604051600160a060020a0390921692600290910280156108fc02929091818181858888f1935050505050610561565b6003546104d19060ff1683610230565b1561050b57600154600454604051600160a060020a0390921691600290910280156108fc02916000818181858888f1935050505050610561565b60008054600454604051600160a060020a039092169281156108fc029290818181858888f15050600154600454604051600160a060020a03909216945080156108fc02935091506000818181858888f150505050505b50506000600455565b600054600160a060020a031681565b600060035460ff16600581111561058c57fe5b141561059757600080fd5b6005546006540142116105a957600080fd5b600154600454604051600160a060020a0390921691600290910280156108fc02916000818181858888f150506000600455505050565b600554815600a165627a7a7230582020fee3398e3149d0b807f0109312ff910d887caeea7f92be19f42fa1c7cc719c0029",
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
        this.gameContract = new this.web3.eth.Contract(this.contractAbi,  this.gameContractAddress);
        return transaction;
      });
  }

  calculateRandomString(){
    return this.web3.utils.randomHex(32);
  }

  calculateHash(move, salt) {
    return this.hasherContract.methods.hash(move, salt).call({from: this.defaultUserAccount});
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
    return this.gameContract.methods.stake().call({from: this.defaultUserAccount});
  }
}
