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

## Apple Sample Health data

### 1) Running Case

- task condition:

```(json)
    {
    "activity": 1,
    "numTimes": 3,
    "totalTimes": 7,
    "condition": {
        "distance": 10,
        "minPace": 8.5
    },
    "startTime": "1713461819000",
    "endTime": "1714680219000"
}
```

- sample health data:

```(json)
    {
    "data": [
        {
            "sampleDetails": {
                "workoutType": "Running",
                "startTime": 1713555056252,
                "endTime": 1713557179328,
                "pace": 17.55,
                "duration": 0.5897435897435896,
                "indoorWorkout": false
            },
            "deviceDetail": {
                "name": "Apple Watch",
                "manufacturer": "Apple Inc.",
                "model": "Watch"
            },
            "relatedSamples": {
                "distance": 10.35,
                "averageHeartRate": 135,
                "totalActiveEnergy": 200,
                "totalSteps": 4000
            }
        },
        {
            "sampleDetails": {
                "workoutType": "Running",
                "startTime": 1713552943654,
                "endTime": 1713555357850,
                "pace": 16.06,
                "duration": 0.6706102117061021,
                "indoorWorkout": false
            },
            "deviceDetail": {
                "name": "Apple Watch",
                "manufacturer": "Apple Inc.",
                "model": "Watch"
            },
            "relatedSamples": {
                "distance": 10.77,
                "averageHeartRate": 141,
                "totalActiveEnergy": 200,
                "totalSteps": 4000
            }
        },
        {
            "sampleDetails": {
                "workoutType": "Running",
                "startTime": 1713566955590,
                "endTime": 1713572146194,
                "pace": 8.94,
                "duration": 1.4418344519015662,
                "indoorWorkout": false
            },
            "deviceDetail": {
                "name": "Apple Watch",
                "manufacturer": "Apple Inc.",
                "model": "Watch"
            },
            "relatedSamples": {
                "distance": 12.89,
                "averageHeartRate": 135,
                "totalActiveEnergy": 200,
                "totalSteps": 4000
            }
        }
    ]
}
```

### 2) Sleeping Case

- task condition:

```(json)
    {
    "activity": 0,
    "numTimes": 2,
    "totalTimes": 2,
    "condition": {
        "sleepBefore": "23:00",
        "sleepLength": 7
    },
    "startTime": "1713461819000",
    "endTime": "1714680219000"
}

```

- sample health data:

```(json)
    {
    "data": [
        {
            "inBedTime": 1713579245586,
            "sleepLength": 11.48,
            "source": "Apple Watch"
        },
        {
            "inBedTime": 1713663334230,
            "sleepLength": 10.74,
            "source": "Apple Watch"
        }
    ]
}
```

### 3) Mindfulness Case

- task condition:

```(json)
    {
    "activity": 2,
    "numTimes": 2,
    "totalTimes": 7,
    "condition": {
        "numPerDay": 2
    },
    "startTime": "1713461819000",
    "endTime": "1714680219000"
}
```

- sample health data:

```(json)
    {
    "data": [
        {
            "date": "2024-04-18T04:00:00.000Z",
            "data": [
                {
                    "startTime": 1713465880565,
                    "endTime": 1713465940565,
                    "source": "Apple Watch"
                },
                {
                    "startTime": 1713474550303,
                    "endTime": 1713474610303,
                    "source": "Apple Watch"
                }
            ]
        },
        {
            "date": "2024-04-19T04:00:00.000Z",
            "data": [
                {
                    "startTime": 1713539834398,
                    "endTime": 1713539894398,
                    "source": "Apple Watch"
                },
                {
                    "startTime": 1713578663593,
                    "endTime": 1713578723593,
                    "source": "Apple Watch"
                }
            ]
        }
    ]
}
```
