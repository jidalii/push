pragma circom 2.1.6;

include "https://github.com/0xPARC/circom-ecdsa/blob/master/circuits/ecdsa.circom";
include "circomlib/poseidon.circom";


template BreathTaskVerifier() {

    signal input startTime, endTime, numPerDay;
    signal input minStartTime, maxEndTime, minNumPerDay;

    signal valid;

    signal input r[4];     
    signal input s[4];    
    signal input msghash[4];  
    signal input pubkey[2][4];  

    component verifier = ECDSAVerifyNoPubkeyCheck(64, 4);

    for (var i = 0; i < 4; i++) {
        verifier.r[i] <== r[i];
        verifier.s[i] <== s[i];
        verifier.msghash[i] <== msghash[i];
        verifier.pubkey[0][i] <== pubkey[0][i];
        verifier.pubkey[1][i] <== pubkey[1][i];
    }

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
    signal intermediate1, intermediate2, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    intermediate2 <== intermediate1 * verifier.result;
    final <== intermediate2 * breathCheck.out;
    


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, minNumPerDay, pubkey] } = BreathTaskVerifier();
