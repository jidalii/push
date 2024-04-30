// The contract ABI
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AlreadyClaimed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ClaimBeforeDeadline",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "claimMissDeadlineTask",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_taskIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_passVerified",
				"type": "bool"
			}
		],
		"name": "claimReward",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DeadlineMiss",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InsufficientAmount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidClaimer",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidIndex",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidProof",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidReward",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidTaskStatus",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoReentrancy",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_beneficiary",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "_activity",
				"type": "uint8"
			},
			{
				"internalType": "uint16",
				"name": "_numTimes",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_totalTimes",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_condition1",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "_condition2",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "_reward",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_endTime",
				"type": "uint256"
			}
		],
		"name": "postTask",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TaskNotFound",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "beneficiary",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "taskIndex",
				"type": "uint256"
			}
		],
		"name": "ClaimReward",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "beneficiary",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "taskIndex",
				"type": "uint256"
			}
		],
		"name": "PostTask",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "APPLE_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hello",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextTaskIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tasks",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "depositor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "beneficiary",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "activity",
				"type": "uint8"
			},
			{
				"internalType": "uint16",
				"name": "numTimes",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "totalTimes",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "condition1",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "condition2",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tasksAssigned",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tasksCreated",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "verifyZKProof",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "isBeneficiary",
				"type": "bool"
			}
		],
		"name": "viewTasks",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "depositor",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "beneficiary",
						"type": "address"
					},
					{
						"internalType": "uint8",
						"name": "activity",
						"type": "uint8"
					},
					{
						"internalType": "uint16",
						"name": "numTimes",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "totalTimes",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "condition1",
						"type": "uint16"
					},
					{
						"internalType": "uint16",
						"name": "condition2",
						"type": "uint16"
					},
					{
						"internalType": "uint256",
						"name": "reward",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct PushCoreV1.Task[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]