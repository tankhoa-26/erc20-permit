// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token/ERC20Permit.sol";
import "hardhat/console.sol";
contract Vault {
    ERC20Permit public immutable _token;

    event Deposite(address indexed owner, uint256 amount);
    event DepositeWithPermit(address indexed owner, address indexed depositer, uint256 amount);

    constructor (address token_) {
        _token = ERC20Permit(token_);
    }

    function deposite(uint256 amount) external {
        _token.transferFrom(msg.sender, address(this), amount);

        emit Deposite(msg.sender, amount);
    }

    /**
     * Anyone can call to this function
     */
    function depositeWithPermit(
        address owner, uint256 amount, uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) public
    {
        _token.permit(owner, address(this), amount, deadline, v, r, s);
        _token.transferFrom(msg.sender, address(this), amount);

        emit DepositeWithPermit(owner, msg.sender, amount);
    }
}