// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITaskVerifier {
    function verifyProof(
        uint256[24] calldata _proof,
        uint256[4] calldata _pubSignals
    ) external view returns (bool);
}

contract PushCoreV1 is ReentrancyGuard {
    // global variables
    address payable public owner;

    address public constant APPLE_ADDRESS =
        address(0xC77bFA8247878cf40e00dd27306E63313F894A72);

    ITaskVerifier public runTaskVerifier;
    ITaskVerifier public sleepTaskVerifier;

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
     *  - running: distance 6.85 km -> 685
     *  - sleep: sleepBefore 23:00 -> 2300
     *  - breath: numPerDay
     *
     * condition2:
     *  - running: minPace 3.23 km/h -> 323
     *  - sleep: sleepLength 7.56 h -> 756
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
        uint256 reward;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    mapping(address => uint256[]) public tasksCreated; // Maps user address to list of task IDs they created
    mapping(address => uint256[]) public tasksAssigned; // Maps user address to list of task IDs assigned to them

    Task[] public tasks; // An array to store index of all tasks

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
    error NoReentrancy();
    error TaskNotFound();

    error AlreadyClaimed();
    error ClaimBeforeDeadline();
    error DeadlineMiss();

    error InvalidProof();
    error InvalidClaimer();

    error InvalidActivity();
    error InvalidTaskStatus();
    error InsufficientAmount();
    error InvalidReward();
    error InvalidIndex();
    error InvalidAddress();

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
    modifier postTaskCheck(uint256 _reward, address _beneficiary) {
        // uint256 _rewardInWei = _reward;
        if (_reward == 0) {
            revert InvalidReward();
        }

        if (msg.value < _reward) {
            revert InsufficientAmount();
        }

        if (_beneficiary == address(0)) {
            revert InvalidAddress();
        }

        _;
    }

    /**
     * checks if rewards have already been claimed, if sender is beneficiary of deposit and if task is verified
     */
    modifier claimRewardCheck(
        uint256 _taskIndex,
        uint[4] calldata _pubSignals
    ) {
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

        // if (userTask.endTime < block.timestamp) {
        //     revert DeadlineMiss();
        // }

        // check whether public signals are equal to those defined in the Task
        require(
            userTask.startTime == _pubSignals[0] &&
                userTask.endTime == _pubSignals[1] &&
                userTask.condition2 == _pubSignals[2] &&
                userTask.condition1 == _pubSignals[3],
            "InvalidPubSignals"
        );

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

    constructor(
        address _runTaskVerifierAddress,
        address _sleepTaskVerifierAddress
    ) payable {
        owner = payable(msg.sender);
        runTaskVerifier = ITaskVerifier(_runTaskVerifierAddress);
        sleepTaskVerifier = ITaskVerifier(_sleepTaskVerifierAddress);
    }

    function _findIndexes(
        bool isBeneficiary
    ) private view returns (uint256[] memory) {
        uint256[] memory indexes;
        if (isBeneficiary) {
            indexes = tasksAssigned[msg.sender];
        } else {
            indexes = tasksCreated[msg.sender];
        }
        return indexes;
    }

    function _findTasks(
        uint256[] memory indexes
    ) private view returns (Task[] memory) {
        Task[] memory userTasks = new Task[](indexes.length);

        for (uint256 i = 0; i < indexes.length; i++) {
            userTasks[i] = tasks[indexes[i]];
        }
        return userTasks;
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
        uint256 _reward,
        uint256 _startTime,
        uint256 _endTime
    ) external payable lock postTaskCheck(_reward, _beneficiary) {
        Task memory newTask = Task({
            index: nextTaskIndex,
            depositor: msg.sender,
            beneficiary: _beneficiary,
            activity: _activity,
            numTimes: _numTimes,
            totalTimes: _totalTimes,
            condition1: _condition1,
            condition2: _condition2,
            reward: _reward * 1 ether,
            startTime: _startTime,
            endTime: _endTime,
            isActive: true
        });

        tasks.push(newTask);

        tasksCreated[newTask.depositor].push(newTask.index);
        tasksAssigned[newTask.beneficiary].push(newTask.index);

        nextTaskIndex++;

        emit PostTask(msg.sender, _beneficiary, newTask.index);
    }

    function claimReward(
        uint256 _taskIndex,
        uint256[24] calldata _proof,
        uint256[4] calldata _pubSignals
    ) external payable lock claimRewardCheck(_taskIndex, _pubSignals) {
        Task memory userTaskCheck = tasks[_taskIndex];

        bool isValidProof = false;
        if (userTaskCheck.activity == 0) {
            isValidProof = runTaskVerifier.verifyProof(_proof, _pubSignals);
        } else if (userTaskCheck.activity == 1) {
            isValidProof = sleepTaskVerifier.verifyProof(_proof, _pubSignals);
        } else if (userTaskCheck.activity == 2) {} else {
            revert InvalidActivity();
        }

        if (!isValidProof) {
            revert InvalidProof();
        }

        Task storage userTask = tasks[_taskIndex];
        userTask.isActive = false;

        payable(msg.sender).transfer(userTask.reward);

        emit ClaimReward(userTask.beneficiary, msg.sender, _taskIndex);
    }

    function viewTasks(
        bool isBeneficiary
    ) external view returns (Task[] memory) {
        uint256[] memory indexes = _findIndexes(isBeneficiary);

        if (indexes.length == 0) {
            revert TaskNotFound();
        }

        Task[] memory userTasks = _findTasks(indexes);

        return userTasks;
    }

    function claimMissDeadlineTask(
        uint256 _index
    ) external payable lock deadlineClaimCheck(_index) {
        Task storage userTask = tasks[_index];
        userTask.isActive = false;
        payable(msg.sender).transfer(userTask.reward);
        emit ClaimReward(msg.sender, userTask.beneficiary, _index);
    }

    function hello(string memory text) external pure returns (string memory) {
        return text;
    }
}
