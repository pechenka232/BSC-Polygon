// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrossChainToken.sol";


contract BridgeContract {
    address public owner;
    CrossChainToken public token;

    event TokensLocked(address indexed user, uint256 amount);
    event TokensUnlocked(address indexed user, uint256 amount);

    constructor(CrossChainToken _token) {
        owner = msg.sender;
        token = _token;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function lockTokens(uint256 amount) public {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        emit TokensLocked(msg.sender, amount);
    }

    function unlockTokens(address user, uint256 amount) public onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient contract balance");
        require(token.transfer(user, amount), "Transfer failed");

        emit TokensUnlocked(user, amount);
    }
}
