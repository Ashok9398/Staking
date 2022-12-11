//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;
import "./TestToken.sol";

contract Staking {
    string public name = "Yield Farming / Token dApp";
    TestToken public testToken;
    address public owner;
    uint256 public defaultAPY = 100;
    uint256 public totalStaked;   

    mapping(address => uint256) public stakingBalance;

    mapping(address => bool) public hasStaked;   
  
    mapping(address => bool) public isStakingAtm;   

    address[] public stakers;   

    constructor(TestToken _testToken)  payable {
        testToken = _testToken;

        owner = msg.sender;
    }

    function stakeTokens(uint256 _amount) public {

        require(_amount > 0, "amount cannot be 0");

        testToken.transferFrom(msg.sender, address(this), _amount);
        totalStaked = totalStaked + _amount;

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

   
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStakingAtm[msg.sender] = true;
        
    }

    

    function unstakeTokens() public {
      

        uint256 balance = stakingBalance[msg.sender];


        require(balance > 0, "amount has to be more than 0");

        testToken.transfer(msg.sender, balance);
        totalStaked = totalStaked - balance;

       
        stakingBalance[msg.sender] = 0;

     
        isStakingAtm[msg.sender] = false;
    }

   

    function redistributeRewards() public {
        
        require(msg.sender == owner, "Only contract creator can redistribute");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];

          
            uint256 balance = stakingBalance[recipient] * defaultAPY;
            balance = balance / 100;

            if (balance > 0) {
                testToken.transfer(recipient, balance);
            }
        }
    }

    
  

    
}