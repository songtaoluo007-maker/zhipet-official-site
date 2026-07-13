-- The official website now keeps only public feedback and its email notification outbox.
DELETE FROM "email_outbox"
WHERE "template" <> 'OPERATOR_FEEDBACK';

ALTER TYPE "EmailTemplate" RENAME TO "EmailTemplate_old";
CREATE TYPE "EmailTemplate" AS ENUM ('OPERATOR_FEEDBACK');
ALTER TABLE "email_outbox"
ALTER COLUMN "template" TYPE "EmailTemplate"
USING ("template"::text::"EmailTemplate");
DROP TYPE "EmailTemplate_old";

DROP TABLE "account_deletion_requests";
DROP TABLE "consent_records";
DROP TABLE "sessions";
DROP TABLE "pets";
DROP TABLE "household_invitations";
DROP TABLE "household_members";
DROP TABLE "households";
DROP TABLE "admin_audit_logs";
DROP TABLE "users";
DROP TABLE "subscribers";
DROP TABLE "demo_requests";

DROP TYPE "AccountDeletionStatus";
DROP TYPE "ConsentType";
DROP TYPE "PetStatus";
DROP TYPE "PetSex";
DROP TYPE "PetSpecies";
DROP TYPE "HouseholdMemberRole";
DROP TYPE "UserStatus";
DROP TYPE "UserRole";
DROP TYPE "SubscriberStatus";
DROP TYPE "DemoRequestStatus";
DROP TYPE "DemoRequestRole";
