import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const TaskList = ({ CoreContract, isBeneficiary }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await CoreContract.viewTasks(isBeneficiary, {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("10", "gwei"),
      });
      console.log("Transaction successful");
      console.log(response);

      return response;
    } catch (err) {
      console.error("Transaction failed:", err);
      console.log(err.message);
      return [];
    }
  }, [CoreContract, isBeneficiary]); // Dependencies

  useEffect(() => {
    fetchTasks()
      .then((tasks) => setTasks(tasks))
      .catch(console.error);
  }, [fetchTasks]); // fetchTasks is stable now

  function showActivity(activity_num) {
    let activity_str = "";
    switch (activity_num) {
      case 0:
        activity_str = "Running";
        break;
      case 1:
        activity_str = "Sleeping";
        break;
      case 2:
        activity_str = "Breathing";
        break;
      default:
        activity_str = "N/A";
    }
    return activity_str;
  }
  if (!tasks || tasks.length === 0) {
    return <div>No tasks available</div>;
  }

    return (
      <div>
        {tasks.map((task, index) => (
          <div key={index}>
            <h2>Task {index + 1}</h2>
            <p>Activity ID: {parseInt(task.index._hex)}</p>
            <p>Beneficiary: {task.beneficiary}</p>
            <p>Depositor: {task.depositor}</p>
            <p>Activity Type: {showActivity(task.activity)}</p>
            <p>Reward: {ethers.utils.formatUnits(task.reward, 'ether')} Wei</p>
            <p>
              Start Time: {new Date(task.startTime * 1000).toLocaleString()}
            </p>
            <p>End Time: {new Date(task.endTime * 1000).toLocaleString()}</p>
            <p>isActive: {task.isActive ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    );
//   }
};

export default TaskList;
