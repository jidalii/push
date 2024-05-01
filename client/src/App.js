import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";
import TaskList from "./components/TaskList";

const contractAddress = "0x0908a7def53f2777d57293d0c0a0442a16ecded9";

function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [CoreContract, setCoreContract] = useState(null);
  const [formData, setFormData] = useState({
    beneficiary: "0x0804FE35E0c8f40E7DB7eF805587C382ea6E51d4",
    activity: "0",
    numTimes: "1",
    totalTimes: "1",
    condition1: "10",
    condition2: "6",
    reward: "0.005",
    startTime: "1713461819",
    endTime: "1714680219",
  });
  const [claimIndex, setClaimIndex] = useState("");

  const [isValidData, setValidData] = useState(true);

  // const [tasks, setTasks] = useState([]);
  const [isBeneficiary, setBeneficiary] = useState(true);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  const [showDiv1, setShowDiv1] = useState(true); // State to track visibility of div 1
  const [showDiv2, setShowDiv2] = useState(false); // State to track visibility of div 2
  const [showDiv3, setShowDiv3] = useState(false); // State to track visibility of div 2

  const toggleDiv1 = () => {
    setShowDiv1(true);
    setShowDiv2(false);
    setShowDiv3(false);
  };

  const toggleDiv2 = () => {
    setShowDiv1(false);
    setShowDiv2(true);
    setShowDiv3(false);
  };

  const toggleDiv3 = () => {
    setShowDiv1(false);
    setShowDiv2(false);
    setShowDiv3(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the right state property based on input name
    }));
  };

  const handleChangeIndex = (event) => {
    setClaimIndex(event.target.value);
  };

  // Check if the current network is the correct network
  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("ChainId:", chainId);
        setIsCorrectNetwork(chainId === "0x13882"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on(
      "chainChanged",
      (newChainId) => {
        setIsCorrectNetwork(newChainId === "0x13882"); // Change to the correct chain ID
      },
      []
    );
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initCoreContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setCoreContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initCoreContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error(
          "An error occurred while disconnecting the wallet:",
          error
        );
      }
    }
  }

  async function postTask() {
    const {
      beneficiary,
      activity,
      numTimes,
      totalTimes,
      condition1,
      condition2,
      reward,
      startTime,
      endTime,
    } = formData;

    // Convert string inputs to appropriate numeric types
    const activityNum = parseInt(activity);
    const numTimesNum = parseInt(numTimes);
    const totalTimesNum = parseInt(totalTimes);
    const condition1Num = parseInt(condition1);
    const condition2Num = parseInt(condition2);
    const rewardWei = ethers.utils.parseUnits(reward, 18).toString(); // assuming reward is entered in ETH
    const startTimeNum = parseInt(startTime);
    const endTimeNum = parseInt(endTime);

    try {
      const response = await CoreContract.postTask(
        beneficiary, // assuming the account state holds the beneficiary's address
        activityNum,
        numTimesNum,
        totalTimesNum,
        condition1Num,
        condition2Num,
        rewardWei,
        startTimeNum,
        endTimeNum,
        {
          value: ethers.utils.parseUnits(formData.reward, "ether"),
          gasLimit: 500000, // Increase gas limit if necessary
          gasPrice: ethers.utils.parseUnits("10", "gwei"), // Adjust gas price according to current network conditions
        }
      );
      console.log("Transaction successful:", response);
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed: " + err.message);
    }
  }

  async function getTask(index) {
    const response = await CoreContract.tasks(index, {
      gasLimit: 500000,
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
    });
    console.log("View specific task:");
    console.log(response);

    return response;
  }

  function formatTime(time) {
    // Pad the number with zeros to make sure it's at least 4 characters long
    let timeStr = time.toString().padStart(4, "0");

    // Extract hours and minutes based on the string positions
    let hours = timeStr.substr(0, 2);
    let minutes = timeStr.substr(2, 2);

    // Construct the formatted time string
    return `${hours}:${minutes}`;
  }

  function handlePostData(task) {
    let result = {};
    // let startTime = parseInt(task.startTime._hex);
    let startTime = (task.startTime * 1000).toString();
    let endTime = (task.endTime*1000).toString();

    switch (task.activity) {
      case 0:
        result = {
          activity: task.activity,
          numTimes: task.numTimes,
          totalTimes: task.totalTimes,
          condition: {
            distance: task.condition1,
            minPace: task.condition2,
          },
          startTime: startTime,
          endTime: endTime,
        };
        console.log("here", parseInt(task.activity));
        break;
      case 1:
        result = {
          activity: task.activity,
          numTimes: task.numTimes,
          totalTimes: task.totalTimes,
          condition: {
            sleepBefore: formatTime(task.condition1),
            sleepLength: task.condition2,
          },
          startTime: startTime,
          endTime: endTime,
        };
        break;
      case 2:
        result = {
          activity: task.activity,
          numTimes: task.numTimes,
          totalTimes: task.totalTimes,
          condition: {
            numPerDay: 2,
          },
          startTime: startTime,
          endTime: endTime,
        };
        console.log("here2", parseInt(task.activity));
        break;
      default:
        result = {};
    }
    return result;
  }

  const postHealthData = async (task) => {
    try {
      const response = await fetch(
        "http://localhost:8000/healthdata/sample/true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to post data:", error);
    }
  };

  const getZKProof = async (zkData, activity_num) => {
    try {
      let activity = "";
      switch (activity_num) {
        case 0:
          activity = "running";
          break;
        case 1:
          activity = "sleeping";
          break;
        case 2:
          activity = "breathing";
          break;
        default:
          activity = "running";
      }
      const response = await fetch(
        `http://localhost:8000/zkproof/gen/${activity}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(zkData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to post data:", error);
    }
  };

  function genDataForZKProof(taskProcessed, dataZK) {
    let dataForZK = {};
    switch (taskProcessed.activity) {
      case 0:
        dataForZK = {
          startTime: dataZK.startTime,
          endTime: dataZK.endTime,
          pace: dataZK.pace,
          distance: dataZK.distance,
          heartRate: dataZK.heartRate,
          minStartTime: taskProcessed.startTime,
          maxEndTime: taskProcessed.endTime,
          minPace: taskProcessed.condition.minPace,
          minDistance: taskProcessed.condition.distance,
        };
        break;
      case 1:
        dataForZK = {
          startTime: dataZK.startTime,
          endTime: dataZK.endTime,
          sleepLength: dataZK.sleepLength,
          sleepTime: dataZK.sleepTime,
          minStartTime: taskProcessed.starTime,
          maxEndTime: taskProcessed.endTime,
          sleepBefore: taskProcessed.condition.sleepTime,
          minSleepLength: taskProcessed.condition.sleepLength,
        };
        break;

      default:
        dataForZK = {};
    }
    return dataForZK
  }

  async function claimRewards(isValid, index) {
    const theTask = await getTask(index);
    const taskProcessed = handlePostData(theTask);
    console.log("taskProcessed:", taskProcessed);
    const activityData = await postHealthData(taskProcessed);
    console.log("activityData: ", activityData);
    const dataZK = activityData.zk_data;
    console.log("zk_data: ", dataZK, taskProcessed.activity);

    let dataForZK = genDataForZKProof(taskProcessed, dataZK)

    console.log("dataForZK: ", dataForZK);
    const zkProofWhole = await getZKProof(dataForZK, taskProcessed.activity);
    // console.log(zkProofWhole);
    const proofHex = zkProofWhole.proofHex;
    const pubSignalsHex = zkProofWhole.publicSignalsHex;
    console.log("zk-proof:", {
      proofHex: proofHex,
      pubSignalsHex: pubSignalsHex
    });

    const response = await CoreContract.claimReward(index, proofHex, pubSignalsHex, {
      gasLimit: 10000000,
      gasPrice: ethers.utils.parseUnits("10", "gwei"),
    });
    console.log("Claim rewards:");
    console.log(response);

  }

  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h1>🔮 Push</h1>
        <h2>Switch to the Polygon Amoy Network</h2>
        <p>Please switch to the Polygon Amoy network to use this app.</p>
      </div>
    );
  }

  if (account === null) {
    return (
      <>
        <div className="connect-container">
          <br />
          <h1>🔮 Push</h1>

          {isWalletInstalled ? (
            <button className="connect-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="bg">
      <>
        <div className="container">
          <div>
            <button
              className={`contract_btn ${!showDiv1 ? "dark" : ""}`}
              onClick={toggleDiv1}
            >
              Post Tasks
            </button>
            <button
              className={`contract_btn ${!showDiv2 ? "dark" : ""}`}
              onClick={toggleDiv2}
            >
              View Tasks
            </button>
            <button
              className={`contract_btn ${!showDiv3 ? "dark" : ""}`}
              onClick={toggleDiv3}
            >
              Claim Tasks
            </button>
          </div>

          {showDiv1 && (
            <div>
              {/* Content for Post Tasks */}
              <h1>Push Dapp Demo</h1>
              <p>A productivity Dapp that leads you to healiter lifestyle</p>

              <h2>Post Tasks</h2>
              <div>
                <label>
                  Beneficiary:{" "}
                  <input
                    name="beneficiary"
                    // placeholder="0 for run, 1 for sleep, 2 for breath"
                    className="wide-input"
                    value={formData.beneficiary}
                    onChange={handleChange}
                    defaultValue="0"
                  />
                </label>
                <hr />
                <label>
                  Activity:{" "}
                  <input
                    name="activity"
                    // placeholder="0 for run, 1 for sleep, 2 for breath"
                    className="wide-input"
                    value={formData.activity}
                    onChange={handleChange}
                    defaultValue="0"
                  />
                </label>
                <hr />
                <label>
                  numTimes:{" "}
                  <input
                    name="numTimes"
                    // placeholder="Enter a number of times"
                    className="wide-input"
                    value={formData.numTimes}
                    defaultValue="1"
                    onChange={handleChange}
                  />
                </label>
                <hr />
                <label>
                  totalTimes:{" "}
                  <input
                    name="totalTimes"
                    // placeholder="Enter a total of times"
                    className="wide-input"
                    value={formData.totalTimes}
                    defaultValue="1"
                    onChange={handleChange}
                  />
                </label>
                <hr />
                <label>
                  condition1:{" "}
                  <input
                    name="condition1"
                    // placeholder="Enter a condition 1"
                    className="wide-input"
                    value={formData.condition1}
                    defaultValue="10"
                    onChange={handleChange}
                  />
                </label>
                <hr />
                <label>
                  condition2:{" "}
                  <input
                    name="condition2"
                    defaultValue="6"
                    // placeholder="Enter a condition 2"
                    className="wide-input"
                    value={formData.condition2}
                    onChange={handleChange}
                  />
                </label>
                <hr />
                <label>
                  reward:{" "}
                  <input
                    name="reward"
                    // placeholder="Enter an amount of reward"
                    className="wide-input"
                    value={formData.reward}
                    defaultValue="100"
                    onChange={handleChange}
                  />
                </label>
                <hr />
                <label>
                  startTime:{" "}
                  <input
                    name="startTime"
                    // placeholder="Enter a start time"
                    className="wide-input"
                    value={formData.startTime}
                    defaultValue="1606812600"
                    onChange={handleChange}
                  />
                </label>
                <hr />
                <label>
                  endTime:{" "}
                  <input
                    name="endTime"
                    // placeholder="Enter an end time"
                    className="wide-input"
                    value={formData.endTime}
                    defaultValue="1606825200"
                    onChange={handleChange}
                  />
                </label>
                <hr />
              </div>

              <div className="postTask_container">
                <button
                  className="contract_btn"
                  onClick={() => {
                    postTask();
                  }}
                >
                  Post Task
                </button>
              </div>

              <button className="disconnect-button" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>
          )}
          {showDiv2 && (
            <div>
              <h1>Push Dapp Demo</h1>
              <p>A productivity Dapp that leads you to healiter lifestyle</p>
              <h2>View Tasks</h2>
              <div>
                <label>
                  View as:
                  <br></br>
                  <button
                    className={`contract_btn ${
                      !isBeneficiary ? "beneficiary" : ""
                    }`}
                    onClick={() => setBeneficiary(true)}
                  >
                    Beneficiary
                  </button>
                  <button
                    className={`contract_btn ${
                      isBeneficiary ? "depositor" : ""
                    }`}
                    onClick={() => setBeneficiary(false)}
                  >
                    Depositor
                  </button>
                </label>
              </div>

              <TaskList
                CoreContract={CoreContract}
                isBeneficiary={isBeneficiary}
              />
              <button className="disconnect-button" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>
          )}
          {showDiv3 && (
            <div>
              <h1>Push Dapp Demo</h1>
              <p>A productivity Dapp that leads you to healiter lifestyle</p>
              <h2>Claim Rewards</h2>
              <label>
                Index of task you attempt to claim:{" "}
                <input
                  name="claimIndex"
                  // placeholder="0 for run, 1 for sleep, 2 for breath"
                  className="wide-input"
                  value={claimIndex}
                  onChange={handleChangeIndex}
                  defaultValue="0"
                />
              </label>
              <br></br>
              <div>
                <label>
                  Generate valid or invalid data(demo purpose):
                  <br></br>
                  <div>
                    <button
                      className={`contract_btn ${!isValidData ? "dark" : ""}`}
                      onClick={() => setValidData(true)}
                    >
                      Valid
                    </button>
                    <button
                      className={`contract_btn ${isValidData ? "dark" : ""}`}
                      onClick={() => setValidData(false)}
                    >
                      Invalid
                    </button>
                  </div>
                </label>
              </div>
              <div className="postTask_container">
                <button
                  className="contract_btn"
                  onClick={() => {
                    claimRewards(isValidData, claimIndex);
                  }}
                >
                  Claim Rewards
                </button>
              </div>
              <button className="disconnect-button" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
        <div className="container"></div>

      </>
    </div>
  );
}

export default App;
