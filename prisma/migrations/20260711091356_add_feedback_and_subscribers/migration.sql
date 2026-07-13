-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('PRODUCT', 'DEVICE', 'APP', 'CONTENT', 'PRIVACY', 'OTHER');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'REVIEWING', 'INVALID', 'CLOSED');

-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('ACTIVE', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "category" "FeedbackCategory" NOT NULL,
    "message" VARCHAR(2000) NOT NULL,
    "contact" VARCHAR(160),
    "sourcePage" VARCHAR(200) NOT NULL DEFAULT '/help',
    "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "acceptedPrivacyAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyVersion" VARCHAR(80) NOT NULL,
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "sourcePage" VARCHAR(200) NOT NULL DEFAULT '/research',
    "status" "SubscriberStatus" NOT NULL DEFAULT 'ACTIVE',
    "acceptedPrivacyAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyVersion" VARCHAR(80) NOT NULL,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_status_createdAt_idx" ON "feedback"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- CreateIndex
CREATE INDEX "subscribers_status_createdAt_idx" ON "subscribers"("status", "createdAt");
