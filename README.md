# Push: A GameFi Decentralized Application (DApp) to Promote Healthy Living

Link for slide: [Google Slide](https://docs.google.com/presentation/d/1D3DmxGzffLqrfuHk9dP5tvWJpdKCDeVKtFpq091qI2I/edit?usp=sharing)

## Introduction

Welcome to Push, a revolutionary GameFi DApp designed to incentivize and reward healthy lifestyle choices among friends. With Push, users can commit to achieving health goals like sleeping before 11 PM or running 10 km per week. Successfully meeting these goals allows you or your friends to claim rewards, fostering a supportive community driven by wellness and accountability. Join us in building a healthier future, one task at a time.

## Background

Modern lifestyle leads to poor health habits. Traditional digital health tools lack sustained engagement and accountability for users.

Blockchain provides transparency and fairness. Push leverages blockchain for gamifying health activities, offering transparent tracking and rewards. And zero knowledge cryptography provides privacy for users by giving users a chance to prove that they only satisfy the given constraints of a task rather than revealing their whole information.

Push gamifies health goals via making users able to post tasks for themselves. It focuses on a wide range of health commitments and incorporates deep social interactions.

## Toolkit

1. Frontend: React.js
2. Backend: Express.js, hardhat, snarkjs
3. Smart Contract: Solidity, Polygon
4. zk-proof: circom, snarkjs, circomlib, circom-ecdsa

## Setup server

### 1) install dependencies

```(shell)
    cd server
    npm install
```

## File Structure

1. Frontend: [./client](./client)
2. Backend: [./server](./server)
3. Smart contract: [./smart-contract](./smart-contract)
4. Circom: [./zk](./zk)

## Architecture

To view more about the interface, workout of posting tasks and claiming rewards, please go to [flowchart.drawio](./server/flowchart.drawio):

1. Page 1: interface

2. Page 2: mode

3. Page 3: workflow of posting a task

4. Page 4: workflow of claiming rewards

