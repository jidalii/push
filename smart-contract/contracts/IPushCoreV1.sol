// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IPushCoreV1 {
    // Events
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

    // Required functions
    function postTask(
        address _beneficiary,
        uint8 _activity,
        uint16 _numTimes,
        uint16 _totalTimes,
        uint16 _condition1,
        uint16 _condition2,
        uint256 _reward,
        uint256 _startTime,
        uint256 _endTime
    ) external payable;

    function viewTasks(
        bool isBeneficiary
    ) external view returns (Task[] memory);

    function claimReward(
        uint256 _taskIndex,
        uint256[24] calldata _proof,
        uint256[4] calldata _pubSignals
    ) external payable;

    function claimMissDeadlineTask(uint256 _index) external payable;
}
