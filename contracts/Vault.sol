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

    /**
     * This function is used for typical deposit.
     * User (Who deposit) must approve this contract (by his tokens) before calling this function .
     */
    function deposit(uint256 amount) external {
        _token.transferFrom(msg.sender, address(this), amount);

        emit Deposite(msg.sender, amount);
    }

    /**
     * Anyone can call this function.
     * Don't care about who calls the function (who pays the fee).
     * Don't need to approve before calling.
     * The user (Who deposits - token's owner) needs to supply his correct signature.
     */
    function depositWithPermit(
        address owner, uint256 amount, uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) public
    {
        _token.permit(owner, address(this), amount, deadline, v, r, s);
        _token.transferFrom(owner, address(this), amount);

        emit DepositeWithPermit(owner, msg.sender, amount);
    }
}