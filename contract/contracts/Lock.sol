// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Lock {
    uint public unlockTime;
    address payable public owner;
    event Received(address sender, uint amount);
    
    mapping(address => uint256) public balances; // Số dư ETH của user
    mapping(address => uint256) public tokenBalances; // Số dư Token của user

    event Withdrawal(address indexed from, uint amount, uint when);
    event Deposit(address indexed from, uint amount, uint when);
    event Conversion(address indexed user, uint256 tokenAmount, uint256 ethAmount);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");

        balances[msg.sender] += msg.value; // Cập nhật số dư user

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw(uint256 amount) public payable {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(balances[msg.sender] >= amount, "Not enough balance");
        require(amount > 0, "Withdraw amount must be greater than zero");

        balances[msg.sender] -= amount; // Trừ số dư trước khi chuyển ETH
        payable(msg.sender).transfer(amount); // Gửi ETH về ví của user

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserBalance(address user) public view returns (uint256) {
        return balances[user]; // Kiểm tra số dư của user bất kỳ
    }

    // Chuyển đổi Token thành ETH và lưu ETH vào contract cho user
 function convertTokenToETH(uint256 tokenAmount) public {
    // Nếu user chưa có token, khởi tạo mặc định là 10 token
    if (tokenBalances[msg.sender] == 0) {
        tokenBalances[msg.sender] = 10;
    }

    require(tokenBalances[msg.sender] >= tokenAmount, "Not enough tokens");

    uint256 ethAmount = tokenAmount * 1 ether; // 1 Token = 1 ETH

    balances[msg.sender] += ethAmount;  // Cộng ETH vào số dư user
    tokenBalances[msg.sender] -= tokenAmount; // Trừ token của user

    emit Conversion(msg.sender, tokenAmount, ethAmount);
}

 function getUserTokenBalance(address user) public view returns (uint256) {
    return tokenBalances[user] == 0 ? 10 : tokenBalances[user]; 
}
  receive() external payable {
        emit Received(msg.sender, msg.value);
    }

}
