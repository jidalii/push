# Push: A GameFi Decentralized Application (DApp) to Promote Healthy Living

## Introduction

Welcome to Push, a revolutionary GameFi DApp designed to incentivize and reward healthy lifestyle choices among friends. With Push, users can commit to achieving health goals like sleeping before 11 PM or running 10 km per week. Successfully meeting these goals allows you or your friends to claim rewards, fostering a supportive community driven by wellness and accountability. Join us in building a healthier future, one task at a time.

## Setup server

### 1) install dependencies

```(shell)
    cd server
    npm install
```

### 2) setup database and prisma

- Make sure you install and starts posgresql in you computer:

```(shell)
    brew install postgresql
    brew services start postgresql
```

- Setup prisma:

```(shell)
    npx prisma generate
    npx prisma migrate dev --name create_initial_tables
```

## Architecture

To view more about the interface, workout of posting tasks and claiming rewards, please go to [flowchart.drawio](./server/flowchart.drawio):

1. Page 1: interface

2. Page 2: mode

3. Page 3: workflow of posting a task

4. Page 4: workflow of claiming rewards
