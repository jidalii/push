pragma circom 2.1.6;

include "https://github.com/0xPARC/circom-ecdsa/blob/master/circuits/ecdsa.circom";
include "circomlib/poseidon.circom";



template GeneralSleepTaskVerifier() {

    signal input startTime, endTime, sleepHour, sleepLength;
    signal input minStartTime, maxEndTime, maxSleepHour, minSleepLength;

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
    signal intermediate1, intermediate2, intermediate3, final;


    // Building AND logic with IsZero to ensure all checks must be true
    intermediate1 <== startTimeCheck.out * endTimeCheck.out;
    intermediate2 <== intermediate1 * sleepHourCheck.out;
    intermediate3 <== intermediate2 * sleepLengthCheck.out;
    final <== intermediate3 * verifier.result;
    


    component checkFinal = IsZero();
    checkFinal.in <== final;


    valid <== 1 - checkFinal.out;
    valid === 1;
    
}


component main { public [minStartTime, maxEndTime, maxSleepHour, minSleepLength, pubkey] } = GeneralSleepTaskVerifier();
