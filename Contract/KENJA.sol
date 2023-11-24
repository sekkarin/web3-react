// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KENJA is ERC20 {
    uint exChangeRateForOneEther = 5;
    constructor() ERC20("KENJA", "KNJ") {
        _mint(address(this), 100000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
    function buy() payable  public  {
        uint tokenReceived = msg.value * exChangeRateForOneEther;
        _transfer(address(this), msg.sender, tokenReceived);
    }
}