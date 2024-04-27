// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PushCoreV1 is ReentrancyGuard {
    // global variables
    address payable public owner;

    address public constant APPLE_ADDRESS =
        address(0xC77bFA8247878cf40e00dd27306E63313F894A72);

    uint256 private balance = 0;

    uint256 private profit = 0;

    uint256 public nextTaskIndex = 0; // A counter to keep track of task IDs

    uint256 private unlocked = 1;

    // Enum to distinguish between types of conditions
    enum ActivityType {
        Running,
        Sleep,
        Mindfulness
    }

    /**
     * @notice 
     * 
     * condition1:
     *  - running: distance
     *  - sleep: sleepBefore
     *  - breath: numPerDay
     * 
     * condition2:
     *  - running: minPace
     *  - sleep: sleepLength
     *  - breath: N/A
     */
    struct Task {
        uint256 index;
        address depositor;
        address beneficiary;
        uint8 activity;
        uint16 numTimes;
        uint16 totalTimes;
        uint16 condition1;
        uint16 condition2;
        // uint16 distance; // 6.85 km -> 685
        // uint16 minPace; // 3.23 km/h -> 323
        // uint16 sleepBefore;
        // uint16 sleepLength; // 7.56 h -> 756
        // uint8 numPerDay;
        uint256 reward;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    mapping(address => uint256[]) public tasksCreated; // Maps user address to list of task IDs they created
    mapping(address => uint256[]) public tasksAssigned; // Maps user address to list of task IDs assigned to them

    Task[] public tasks; // An array to store index of all tasks

    // uint256[] public claimedTasks; // An array to tsore index of all claimed tasks

    // events
    event PostTask(
        address indexed sender,
        address indexed beneficiary,
        uint256 taskIndex
    );

    event ClaimReward(
        address indexed sender,
        address indexed beneficiary,
        uint256 taskIndex
    );

    // errors
    error InvalidProof();

    error AlreadyClaimed();
    error ClaimBeforeDeadline();
    error DeadlineMiss();

    error InvalidClaimer();
    error InvalidTaskStatus();
    error InsufficientAmount();
    error InvalidReward();
    error InvalidIndex();

    error TaskNotFound();

    error NoReentrancy();

    // modifiers
    modifier lock() {
        if (unlocked != 1) {
            revert NoReentrancy();
        }
        unlocked = 0;
        _;
        unlocked = 1;
    }

    /**
     * checks if deposited amount is greater than reward offered for task
     */
    modifier postTaskCheck(uint256 _reward) {
        if (_reward == 0) {
            revert InvalidReward();
        }

        if (msg.value < _reward) {
            revert InsufficientAmount();
        }

        _;
    }

    /**
     * checks if rewards have already been claimed, if sender is beneficiary of deposit and if task is verified
     */
    modifier claimRewardCheck(uint256 _taskIndex, bool _passVerified) {
        if (_taskIndex >= nextTaskIndex) {
            revert InvalidIndex();
        }

        Task memory userTask = tasks[_taskIndex];

        if (userTask.beneficiary != msg.sender) {
            revert InvalidClaimer();
        }

        // check whether the rewards are claimed
        if (userTask.isActive == false) {
            revert AlreadyClaimed();
        }

        if (userTask.endTime < block.timestamp) {
            revert DeadlineMiss();
        }

        // verify whether the sender completes the task
        if (!_passVerified) {
            revert InvalidProof();
        }

        _;
    }

    modifier deadlineClaimCheck(uint256 _taskIndex) {
        Task memory userTask = tasks[_taskIndex];

        if (userTask.beneficiary == msg.sender) {
            revert InvalidClaimer();
        }

        if (userTask.depositor != msg.sender) {
            revert InvalidClaimer();
        }

        if (userTask.endTime > block.timestamp) {
            revert ClaimBeforeDeadline();
        }

        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    // function postTask(address _beneficiary, Task calldata _task)
    function postTask(
        // address depositor,
        address _beneficiary,
        uint8 _activity,
        uint16 _numTimes,
        uint16 _totalTimes,
        uint16 _condition1,
        uint16 _condition2,
        // uint16 _distance,
        // uint16 _minPace,
        // uint16 _sleepBefore,
        // uint16 _sleepLength,
        // uint8 _numPerDay,
        uint256 _reward,
        uint256 _startTime,
        uint256 _endTime
    )
        public
        payable
        postTaskCheck(_reward)
        lock
    {
        Task memory newTask = Task({
            index: nextTaskIndex,
            depositor: msg.sender,
            beneficiary: _beneficiary,
            activity: _activity,
            numTimes: _numTimes,
            totalTimes: _totalTimes,
            condition1: _condition1,
            condition2: _condition2,
            // distance: _distance, 
            // minPace: _minPace, 
            // sleepBefore: _sleepBefore,
            // sleepLength: _sleepLength, 
            // numPerDay: _numPerDay,
            reward: _reward,
            startTime: _startTime,
            endTime: _endTime,
            isActive: false
        });

        tasks.push(newTask);

        tasksCreated[newTask.depositor].push(newTask.index);
        tasksAssigned[newTask.beneficiary].push(newTask.index);

        nextTaskIndex++;

        emit PostTask(msg.sender, _beneficiary, newTask.index);
    }

    function claimReward(uint256 _taskIndex, bool _passVerified)
        public
        payable
        claimRewardCheck(_taskIndex, _passVerified)
        lock
    {
        Task storage userTask = tasks[_taskIndex];
        userTask.isActive = false;

        payable(msg.sender).transfer(userTask.reward);

        emit ClaimReward(userTask.beneficiary, msg.sender, _taskIndex);
    }

    function viewTasks(bool isBeneficiary) public view returns (Task[] memory) {
        uint256[] memory indexes = _findIndexes(isBeneficiary);

        if (indexes.length == 0) {
            revert TaskNotFound();
        }

        Task[] memory userTasks = _findTasks(indexes);

        return userTasks;
    }

    function _findIndexes(bool isBeneficiary)
        private
        view
        returns (uint256[] memory)
    {
        uint256[] memory indexes;
        if (isBeneficiary) {
            indexes = tasksAssigned[msg.sender];
        } else {
            indexes = tasksCreated[msg.sender];
        }
        return indexes;
    }

    function _findTasks(uint256[] memory indexes)
        private
        view
        returns (Task[] memory)
    {
        Task[] memory userTasks = new Task[](indexes.length);

        for (uint256 i = 0; i < indexes.length; i++) {
            userTasks[i] = tasks[indexes[i]];
        }
        return userTasks;
    }

    function claimMissDeadlineTask(uint256 _index)
        public
        payable
        deadlineClaimCheck(_index)
    {
        Task storage userTask = tasks[_index];
        userTask.isActive = false;
        payable(msg.sender).transfer(userTask.reward);
        emit ClaimReward(msg.sender, userTask.beneficiary, _index);
    }

    function hello() public pure returns (string memory) {
        return "hello world";
    }
}
