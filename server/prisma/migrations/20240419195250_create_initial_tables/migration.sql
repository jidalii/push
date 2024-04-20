-- CreateTable
CREATE TABLE "Records" (
    "id" SERIAL NOT NULL,
    "depositor" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "hashCondition" TEXT NOT NULL,
    "rewards" DOUBLE PRECISION NOT NULL,
    "activity" INTEGER NOT NULL,
    "numTimes" INTEGER NOT NULL,
    "totalTimes" INTEGER NOT NULL,
    "condition" JSONB NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Records_pkey" PRIMARY KEY ("id")
);
