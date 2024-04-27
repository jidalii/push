pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";


template running() {

    signal input startTime, endTime, pace, distance, heartRate;
    signal input minStartTime, maxEndTime, minPace, minDistance, minHeartRate;

    signal valid;


    component startTimeCheck = GreaterEqThan(200);
    component endTimeCheck = LessEqThan(200);
    component paceCheck = GreaterEqThan(200);
    component distanceCheck = GreaterEqThan(200);
    component heartRateCheck = GreaterEqThan(200);


    startTimeCheck.in[0] <== startTime;
    startTimeCheck.in[1] <== minStartTime;

    
    endTimeCheck.in[0] <== endTime;
    endTimeCheck.in[1] <== maxEndTime;


    paceCheck.in[0] <== pace;
    paceCheck.in[1] <== minPace;


    distanceCheck.in[0] <== distance;
    distanceCheck.in[1] <== minDistance;


    heartRateCheck.in[0] <== heartRate;
    heartRateCheck.in[1] <== minHeartRate;


    // Intermediate signals for AND logic
    signal intermediate1, intermediate2, intermediate3, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    intermediate2 <== intermediate1 * paceCheck.out;
    intermediate3 <== intermediate2 * distanceCheck.out;
    final <== intermediate3 * heartRateCheck.out;


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, minPace, minDistance, minHeartRate] } = running();


/* INPUT = {
  "startTime": "1606814400",    
  "endTime": "1606821600",      
  "pace": "7",
  "distance": "15",
  "heartRate": "150",
  "minStartTime": "1606812600", 
  "maxEndTime": "1606825200",  
  "minPace": "6",
  "minDistance": "10",
  "minHeartRate": "140"
}
 */
