pragma circom 2.1.6;

include "https://github.com/0xPARC/circom-ecdsa/blob/master/circuits/ecdsa.circom";


template GeneralRunningTaskVerifier() {

    signal input startTime, endTime, pace, distance, heartRate;
    signal input minStartTime, maxEndTime, minPace, minDistance;

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
    component paceCheck = GreaterEqThan(100);
    component distanceCheck = GreaterEqThan(100);
    component heartRateCheck = GreaterEqThan(100);


    startTimeCheck.in[0] <== startTime;
    startTimeCheck.in[1] <== minStartTime;

    
    endTimeCheck.in[0] <== endTime;
    endTimeCheck.in[1] <== maxEndTime;


    paceCheck.in[0] <== pace;
    paceCheck.in[1] <== minPace;


    distanceCheck.in[0] <== distance;
    distanceCheck.in[1] <== minDistance;


    heartRateCheck.in[0] <== heartRate;
    heartRateCheck.in[1] <== 100; // hardcoded 100


    // Intermediate signals for AND logic
    signal intermediate1, intermediate2, intermediate3, intermediate4, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    intermediate2 <== intermediate1 * paceCheck.out;
    intermediate3 <== intermediate2 * distanceCheck.out;
    intermediate4 <== intermediate3 * verifier.result;
    final <== intermediate4 * heartRateCheck.out;


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, minPace, minDistance, pubkey] } = GeneralRunningTaskVerifier();
