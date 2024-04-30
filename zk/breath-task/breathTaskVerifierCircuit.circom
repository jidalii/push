pragma circom 2.1.6;

include "circomlib/circuits/comparators.circom";


template BreathTaskVerifier() {

    signal input startTime, endTime, numPerDay;
    signal input minStartTime, maxEndTime, minNumPerDay;

    signal valid;

    component startTimeCheck = GreaterEqThan(100);
    component endTimeCheck = LessEqThan(100);
    component breathCheck = GreaterEqThan(100);
    
    breathCheck.in[0] <== numPerDay;
    breathCheck.in[1] <== minNumPerDay;

    startTimeCheck.in[0] <== startTime;
    startTimeCheck.in[1] <== minStartTime;

    endTimeCheck.in[0] <== endTime;
    endTimeCheck.in[1] <== maxEndTime;


    // Intermediate signals for AND logic
    signal intermediate1, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    final <== intermediate1 * breathCheck.out;
    


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, minNumPerDay] } = BreathTaskVerifier();


/* INPUT = {
    "startTime": "1666814400",    
  "endTime": "1506821600",
  "numPerDay": "5",
  "minStartTime": "1606812600", 
  "maxEndTime": "1606825200",    
  "minNumPerDay": "3"    
  
}
 */
