ALTER TABLE "demo_requests" ADD COLUMN "retentionExpiresAt" TIMESTAMP(3);
UPDATE "demo_requests"
SET "retentionExpiresAt" = "createdAt" + INTERVAL '365 days';
ALTER TABLE "demo_requests" ALTER COLUMN "retentionExpiresAt" SET NOT NULL;

ALTER TABLE "feedback" ADD COLUMN "retentionExpiresAt" TIMESTAMP(3);
UPDATE "feedback"
SET "retentionExpiresAt" = "createdAt" + INTERVAL '365 days';
ALTER TABLE "feedback" ALTER COLUMN "retentionExpiresAt" SET NOT NULL;

ALTER TABLE "subscribers" ADD COLUMN "retentionExpiresAt" TIMESTAMP(3);
UPDATE "subscribers"
SET "retentionExpiresAt" = "updatedAt" + INTERVAL '730 days';
ALTER TABLE "subscribers" ALTER COLUMN "retentionExpiresAt" SET NOT NULL;

CREATE INDEX "demo_requests_retentionExpiresAt_idx" ON "demo_requests"("retentionExpiresAt");
CREATE INDEX "feedback_retentionExpiresAt_idx" ON "feedback"("retentionExpiresAt");
CREATE INDEX "subscribers_retentionExpiresAt_idx" ON "subscribers"("retentionExpiresAt");
