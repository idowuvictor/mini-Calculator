// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Calculator{
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function add(uint256 _firstNum, uint256 _secondNum) public pure returns(uint256){
        return _firstNum + _secondNum;
    }

    function sub(uint256 _firstNum, uint256 _secondNum) public pure returns(uint256){
        require(_firstNum >= _secondNum, "Negative Number");
        return _firstNum - _secondNum;
    }

    function multiply(uint256 _firstNum, uint256 _secondNum) public pure returns(uint256){
       return _firstNum * _secondNum;
    }

    function transferOwnership(address _newOwner) public {
        require(msg.sender == owner, "Only Owner can transfer Ownership");
        require(_newOwner != address(0), "Invalid Address");
        owner = _newOwner;

    }

}