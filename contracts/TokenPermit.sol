// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token/ERC20Permit.sol";

contract TokenPermit is ERC20, ERC20Permit {
    constructor() ERC20Permit("Token Permit") ERC20("Token Permit", "TP"){}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}