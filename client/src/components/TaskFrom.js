import React, { useState } from "react";

const TaskList = ({ CoreContract, isBeneficiary }) => {
  const [formData, setFormData] = useState({
    beneficiary: "0x0804FE35E0c8f40E7DB7eF805587C382ea6E51d4",
    activity: "0",
    numTimes: "1",
    totalTimes: "1",
    condition1: "10",
    condition2: "6",
    reward: "0.005",
    startTime: "1606812600",
    endTime: "1606825200",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the right state property based on input name
    }));
  };

  return (
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
  );
};

export default TaskList;
