// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(address indexed from,uint amount, uint when);
    event Deposit(address indexed from, uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

     function withdraw(uint256 amount) public payable {
     require(block.timestamp >= unlockTime, "You can't withdraw yet");
     require(msg.sender == owner, "You aren't the owner");
     require(amount > 0, "Withdraw amount must be greater than zero");
     require(address(this).balance >= amount, "Not enough balance in contract");

    emit Withdrawal(msg.sender, amount, block.timestamp);
    owner.transfer(amount);
}


    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
     function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
