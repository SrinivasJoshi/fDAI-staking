// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.9;

    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

    //stake DAI and get RDT token
    contract RadishStaking is ERC20,ReentrancyGuard{

        mapping(address => bool) isStaked;
        mapping(address => uint256) stakes;
        mapping(address => uint256) yieldCount;
        mapping(address => uint256) timestamp;
        uint256 public rewardRate;
        IERC20 public daiToken;
        address public owner;

        event Stake(address indexed staker,uint256 amountStaked);
        event Unstake(address indexed staker,uint256 amountStaked);
        event WithdrawYield(address indexed staker,uint256 YieldCollected);

        constructor(uint256 _rewardRate,address daiAddress) ERC20("RDT","RadishToken"){
            require(_rewardRate > 0,"Reward rate cannot be 0");
            rewardRate = _rewardRate;
            daiToken = IERC20(daiAddress);
        }

        function stake(uint256 _amount) external nonReentrant{
            //check if user has required DAI balance 
            require(_amount >0 && daiToken.balanceOf(msg.sender) > _amount,"Cannot stake 0 tokens!");

            if(isStaked[msg.sender] == true){
                uint256 yieldTillNow = calculateYield(msg.sender);
                yieldCount[msg.sender] += yieldTillNow;
            }
            //transfer DAI from user to contract
            daiToken.transferFrom(msg.sender,address(this),_amount);

            //change state
            stakes[msg.sender] = _amount;
            isStaked[msg.sender] = true;
            timestamp[msg.sender] = block.timestamp;

            //emit event 
            emit Stake(msg.sender,_amount);
        }

        function unstake(uint256 _amount) external nonReentrant{
            require(stakes[msg.sender] > _amount && isStaked[msg.sender],"Nothing to unstake");

            //yield calculate
            uint256 yieldTillNow = calculateYield(msg.sender);
            
            //change state
            stakes[msg.sender] -= _amount;
            timestamp[msg.sender] = block.timestamp;
            yieldCount[msg.sender] += yieldTillNow;
            if(stakes[msg.sender] == 0){
                isStaked[msg.sender] = false;
            }

            //transfer DAI
            daiToken.transfer(msg.sender,_amount);
            
            //emit event
            emit Unstake(msg.sender,_amount);
        }

        function withdrawYield() external nonReentrant{
            uint256 yieldTokens = calculateYield(msg.sender);
            require(yieldTokens >0 || yieldCount[msg.sender] > 0,"No yield to withdraw");

            //change state
            if(yieldCount[msg.sender]!=0){
                yieldTokens += yieldCount[msg.sender];
                yieldCount[msg.sender] = 0;
            }
            timestamp[msg.sender] = block.timestamp;

            //send yield
            _mint(msg.sender,yieldTokens);

            //emit event
            emit WithdrawYield(msg.sender,yieldTokens);
        }

        function calculateYield(address user) public view returns(uint256) {
            uint256 time = calculateYieldTime(user) * 10**18;
            uint256 timeRate = time / rewardRate;
            uint256 rawYield = (stakes[user] * timeRate) / 10**18;
            return rawYield;
        } 
        function calculateYieldTime(address user) internal  view returns(uint256){
            uint256 end = block.timestamp;
            uint256 totalTime = end - timestamp[user];
            return totalTime;
        }

        function stakesOfUser(address user) external view returns(uint256){
            return stakes[user];
        }

        function updateRewardRate(uint256 newRewardRate) external {
            require(msg.sender == owner, "Forbidden!");
            rewardRate = newRewardRate;
        }

    }