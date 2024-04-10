-- CreateTable
CREATE TABLE "Cid" (
    "id" INTEGER NOT NULL,
    "cid" JSONB NOT NULL,

    CONSTRAINT "Cid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "depositor" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "activity" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "claimed" BOOLEAN NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
