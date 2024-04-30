const contractAddress = '0xDBeb5B70602324f4F7A78D645ad50eB5c9131D78'; // Replace with your contract's address

let contract;
let provider;
let signer;

async function initApp() {
    const provider = await detectEthereumProvider();
    if(provider) {
        startApp(provider); // Initialize your app
        console.log("initialization complete");
    } else {
        console.log('Please install MetaMask!');
    }
}


function startApp(provider) {
    window.ethereum.request({ method: "eth_requestAccounts" }).then(function (accounts) {
        const providerUrl = 'https://rpc-amoy.polygon.technology/'; 
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        // const wallet = new ethers.Wallet("a0e4ad31c8f604ee38e6124f1f22feef4304d14222593b368e80db0e5ef5c230", provider);
        console.log(provider);
        // const signer = wallet.provider.getSigner(wallet.address);
        const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        
        
	    console.log(contract);
        
	    


    }).catch(function (error) {
        console.error(error);
    });
}


async function submitString() {
    // Show the loading indicator
    
    
    const beneficiary = "0x98C5C2C846936179Bb3C809E3F744eE6dfb9b515";
    const activity = document.getElementById('Activity').value;
    const numTimes = document.getElementById('numTimes').value;
    const totalTimes = document.getElementById('totalTimes').value;
    const condition1 = document.getElementById('condition1').value;
    const condition2 = document.getElementById('condition2').value;
    const reward = document.getElementById('reward').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    try {
        console.log(activity)
        console.log(numTimes)
        console.log(totalTimes)
        console.log(condition1)
        console.log(condition2)
        console.log(reward)
        console.log(startTime)
        console.log(endTime)
        
        const txResponse = await contract.postTask(beneficiary, activity, numTimes, totalTimes, condition1, condition2, reward, startTime, endTime, { gasLimit: 2000000 });
        // const txResponse = await contract.hello();    
        
        
        console.log(txResponse);
        
        console.log('Transaction submitted!');
        console.log('Transaction hash:', txResponse.hash);

        document.getElementById('txHashDisplay').innerText = `Transaction Hash: ${txResponse.hash}`;
    } catch (error) {
        console.error('Error submitting task:', error);
    } finally {
        // Hide the loading indicator regardless of the outcome
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}


async function fetchHealthData1() {
    // Your JSON data
    const data = {
    "activity": 1,
    "numTimes": 1,
    "totalTimes": 1,
    "condition": {
      "distance": 10,
      "minPace": 7
    },
    "startTime": "1713461819000",
    "endTime": "1714682019000"
  };
  
  // Fetch options
  const fetchOptions = {
    method: 'POST', // or 'GET' if you're getting data
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  };
  
  // Perform the fetch operation
  fetch('http://localhost:8000/healthdata/sample/true', fetchOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // or response.text() if the response is not in JSON format
    })
    .then(jsonResponse => {
      console.log(jsonResponse); // Handle the JSON response here
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
fetchHealthData1()

async function fetchHealthData2() {
  // Your JSON data
  const data = {
      startTime: "1606814400",
      endTime: "1606821600",
      pace: "7",
      distance: "15",
      heartRate: "150",
      minStartTime: "1606812600",
      maxEndTime: "1606825200",
      minPace: "6",
      minDistance: "10",
  };

  // Fetch options
  const fetchOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };

  try {
      // Perform the fetch operation
      const response = await fetch('http://localhost:8000/zkproof/gen/running', fetchOptions);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse); // Handle the JSON response here
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
  }
}

fetchHealthData2();




document.addEventListener('DOMContentLoaded', (event) => {
    initApp();
    // Listen for the NewStringUploaded event
    document.getElementById('submitStringButton').addEventListener('click', submitString);
    
});


