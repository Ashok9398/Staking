const {ethers} =require("hardhat");
const {expect,assert} = require("chai");

let token;
let staking;
let accounts;

describe('Staking', () => { 
    beforeEach("Contract deploys",async()=>{
        accounts = await ethers.getSigners();
        const testtoken = await ethers.getContractFactory("TestToken");
        token = await testtoken.deploy();
        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(token.address);

    })
    it("Checks for contract deployment",async()=>{
        expect(await staking.owner()).to.equal(accounts[0].address);
    })
    describe("It checks for stake token function",async()=>{
        it("checks for balance of token and staking contract  before staking",async()=>{
            expect(await token.balanceOf(accounts[0].address)).to.equal(1000);
            expect(await staking.totalStaked()).to.equal(0);
        })
        it("Should stake ",async()=>{
            await token.approve(staking.address,100);
            await staking.stakeTokens(10);
            expect(await staking.totalStaked()).to.equal(10);
            expect(await staking.stakers(0)).to.equal(accounts[0].address);
            expect(await staking.hasStaked(accounts[0].address)).to.equal(true);
            
        })
    })
    describe("Checks for Unstake tokens",async()=>{
        it("Checks for unstaking ",async()=>{
            await token.approve(staking.address,100);
            await staking.stakeTokens(10);
            expect(await staking.totalStaked()).to.equal(10);
            await staking.unstakeTokens();
            expect(await staking.totalStaked()).to.equal(0);
            expect(await staking.stakingBalance(accounts[0].address)).to.equal(0);
            expect(await staking.isStakingAtm(accounts[0].address)).to.equal(false);
        })

    })
    describe('It checks for redistribute function', () => { 
        it("Checks for rewards",async()=>{
            await token.approve(staking.address,100);

            await staking.stakeTokens(10);
            
            await staking.redistributeRewards();
            console.log(await token.balanceOf(accounts[0].address));
        })
     })
 })