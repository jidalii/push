# Starting with phase 1 of the Powers of Tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v

# Contribute to the Powers of Tau
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v

# Prepare phase 2
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

# Compile the circuit
circom ./circuits/running.circom --r1cs --wasm --sym

# Start the zKey generation
snarkjs groth16 setup running.r1cs pot12_final.ptau pot12_0000.zkey

# Contribute to the zKey
snarkjs zkey contribute pot12_0000.zkey circuit_final.zkey --name="1st Contributor Name" -v

# Export the verification key
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
