// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PlayerManager {
    mapping(address => uint256) public balances;
    address[] public players;
    mapping(address => bool) public isPlayer;

    event TokenEarned(address indexed player, uint256 amount);
    event TokenSpent(address indexed player, uint256 amount);

    function earnToken(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        if (!isPlayer[msg.sender]) {
            players.push(msg.sender);
            isPlayer[msg.sender] = true;
        }
        balances[msg.sender] += amount;
        emit TokenEarned(msg.sender, amount);
    }

    function spendToken(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Not enough balance");
        balances[msg.sender] -= amount;
        emit TokenSpent(msg.sender, amount);
    }

    function getAllPlayers() public view returns (address[] memory) {
        return players;
    }
}
