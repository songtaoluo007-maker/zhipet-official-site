CREATE TYPE "AccountDeletionStatus" AS ENUM ('REQUESTED', 'CANCELED', 'COMPLETED');

CREATE TABLE "account_deletion_requests" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "AccountDeletionStatus" NOT NULL DEFAULT 'REQUESTED',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "canceledAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "account_deletion_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admin_audit_logs" (
  "id" TEXT NOT NULL,
  "actorUserId" TEXT,
  "action" VARCHAR(80) NOT NULL,
  "entityType" VARCHAR(80) NOT NULL,
  "entityId" VARCHAR(100) NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "account_deletion_requests_userId_key"
ON "account_deletion_requests"("userId");

CREATE INDEX "account_deletion_requests_status_scheduledFor_idx"
ON "account_deletion_requests"("status", "scheduledFor");

CREATE INDEX "admin_audit_logs_actorUserId_createdAt_idx"
ON "admin_audit_logs"("actorUserId", "createdAt");

CREATE INDEX "admin_audit_logs_entityType_entityId_createdAt_idx"
ON "admin_audit_logs"("entityType", "entityId", "createdAt");

ALTER TABLE "account_deletion_requests"
ADD CONSTRAINT "account_deletion_requests_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "admin_audit_logs"
ADD CONSTRAINT "admin_audit_logs_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
