pragma circom 2.1.6;

include "circomlib/circuits/comparators.circom";


template GeneralSleepTaskVerifier() {

    signal input startTime, endTime, sleepHour, sleepLength;
    signal input minStartTime, maxEndTime, maxSleepHour, minSleepLength;

    signal valid;


    component startTimeCheck = GreaterEqThan(100);
    component endTimeCheck = LessEqThan(100);
    component sleepHourCheck = LessEqThan(100);
    component sleepLengthCheck = GreaterEqThan(100);
    


    startTimeCheck.in[0] <== startTime;
    startTimeCheck.in[1] <== minStartTime;

    
    endTimeCheck.in[0] <== endTime;
    endTimeCheck.in[1] <== maxEndTime;


    sleepHourCheck.in[0] <== sleepHour;
    sleepHourCheck.in[1] <== maxSleepHour;


    sleepLengthCheck.in[0] <== sleepLength;
    sleepLengthCheck.in[1] <== minSleepLength;




    // Intermediate signals for AND logic
    signal intermediate1, intermediate2, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    intermediate2 <== intermediate1 * sleepHourCheck.out;
    final <== intermediate2 * sleepLengthCheck.out;
    


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, maxSleepHour, minSleepLength] } = GeneralSleepTaskVerifier();


/* INPUT = {
  "startTime": "1606814400",    
  "endTime": "1606821600",      
  "sleepHour": "5",
  "sleepLength": "10",
  "minStartTime": "1606812600", 
  "maxEndTime": "1606825200",  
  "maxSleepHour": "6",
  "minSleepLength": "8"
}
 */
