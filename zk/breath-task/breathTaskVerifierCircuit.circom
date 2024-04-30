pragma circom 2.1.6;

include "circomlib/circuits/comparators.circom";


template BreathTaskVerifier() {

    signal input numPerDay;
    signal input minNumPerDay;

    signal valid;


    component breathCheck = GreaterEqThan(100);
    
    breathCheck.in[0] <== numPerDay;
    breathCheck.in[1] <== minNumPerDay;


    valid <== breathCheck.out;
    valid === 1;
    
}


component main { public [minNumPerDay] } = BreathTaskVerifier();


/* INPUT = {
  "numPerDay": "5",    
  "minNumPerDay": "3"    
  
}
 */
