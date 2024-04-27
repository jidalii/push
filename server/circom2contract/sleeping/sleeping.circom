pragma circom 2.1.6;

include "../../node_modules/circomlib/circuits/comparators.circom";


template GeneralSleepTaskVerifier() {

    signal input startTime, endTime, sleepTime, sleepLength;
    signal input minStartTime, maxEndTime, sleepBefore, minSleepLength;

    signal valid;


    component startTimeCheck = GreaterEqThan(100);
    component endTimeCheck = LessEqThan(100);
    component sleepTimeCheck = LessEqThan(100);
    component sleepLengthCheck = GreaterEqThan(100);
    


    startTimeCheck.in[0] <== startTime;
    startTimeCheck.in[1] <== minStartTime;

    
    endTimeCheck.in[0] <== endTime;
    endTimeCheck.in[1] <== maxEndTime;


    sleepTimeCheck.in[0] <== sleepTime;
    sleepTimeCheck.in[1] <== sleepBefore;


    sleepLengthCheck.in[0] <== sleepLength;
    sleepLengthCheck.in[1] <== minSleepLength;




    // Intermediate signals for AND logic
    signal intermediate1, intermediate2, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    intermediate2 <== intermediate1 * sleepTimeCheck.out;
    final <== intermediate2 * sleepLengthCheck.out;
    


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, sleepBefore, minSleepLength] } = GeneralSleepTaskVerifier();


/* INPUT = {
  "startTime": "1606814400",    
  "endTime": "1606821600",      
  "sleepTime": "5",
  "sleepLength": "10",
  "minStartTime": "1606812600", 
  "maxEndTime": "1606825200",  
  "sleepBefore": "6",
  "minSleepLength": "8"
}
 */
