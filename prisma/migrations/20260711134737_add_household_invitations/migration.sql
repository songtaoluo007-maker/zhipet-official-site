-- CreateTable
CREATE TABLE "household_invitations" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "acceptedByUserId" TEXT,
    "email" VARCHAR(320) NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "household_invitations_tokenHash_key" ON "household_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "household_invitations_householdId_email_createdAt_idx" ON "household_invitations"("householdId", "email", "createdAt");

-- CreateIndex
CREATE INDEX "household_invitations_email_expiresAt_idx" ON "household_invitations"("email", "expiresAt");

-- CreateIndex
CREATE INDEX "household_invitations_invitedByUserId_createdAt_idx" ON "household_invitations"("invitedByUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "household_invitations" ADD CONSTRAINT "household_invitations_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_invitations" ADD CONSTRAINT "household_invitations_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_invitations" ADD CONSTRAINT "household_invitations_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
