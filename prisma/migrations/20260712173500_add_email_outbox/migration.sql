CREATE TYPE "EmailOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');
CREATE TYPE "EmailTemplate" AS ENUM ('OPERATOR_DEMO_REQUEST', 'OPERATOR_FEEDBACK', 'OPERATOR_SUBSCRIBER', 'HOUSEHOLD_INVITATION');

CREATE TABLE "email_outbox" (
    "id" TEXT NOT NULL,
    "deduplicationKey" VARCHAR(180) NOT NULL,
    "template" "EmailTemplate" NOT NULL,
    "recipient" VARCHAR(320) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "textBody" TEXT NOT NULL,
    "status" "EmailOutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAttemptAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "lastErrorCode" VARCHAR(80),
    "retentionExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_outbox_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_outbox_deduplicationKey_key" ON "email_outbox"("deduplicationKey");
CREATE INDEX "email_outbox_status_nextAttemptAt_createdAt_idx" ON "email_outbox"("status", "nextAttemptAt", "createdAt");
CREATE INDEX "email_outbox_retentionExpiresAt_idx" ON "email_outbox"("retentionExpiresAt");
