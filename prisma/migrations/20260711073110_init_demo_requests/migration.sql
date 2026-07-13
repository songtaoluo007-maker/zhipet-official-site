-- CreateEnum
CREATE TYPE "DemoRequestRole" AS ENUM ('FAMILY', 'HOSPITAL', 'STORE', 'PARTNER', 'INVESTOR', 'OTHER');

-- CreateEnum
CREATE TYPE "DemoRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'INVALID', 'CLOSED');

-- CreateTable
CREATE TABLE "demo_requests" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "contact" VARCHAR(160) NOT NULL,
    "organization" VARCHAR(160),
    "role" "DemoRequestRole" NOT NULL,
    "message" VARCHAR(1000),
    "sourcePage" VARCHAR(200) NOT NULL DEFAULT '/demo',
    "status" "DemoRequestStatus" NOT NULL DEFAULT 'PENDING',
    "acceptedPrivacyAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyVersion" VARCHAR(80) NOT NULL,
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demo_requests_status_createdAt_idx" ON "demo_requests"("status", "createdAt");
