-- CreateEnum
CREATE TYPE "HouseholdMemberRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "PetSpecies" AS ENUM ('DOG', 'CAT', 'OTHER');

-- CreateEnum
CREATE TYPE "PetSex" AS ENUM ('UNKNOWN', 'MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'RETIRED');

-- CreateTable
CREATE TABLE "households" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_members" (
    "householdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "HouseholdMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_members_pkey" PRIMARY KEY ("householdId","userId")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "species" "PetSpecies" NOT NULL,
    "breed" VARCHAR(80),
    "sex" "PetSex" NOT NULL DEFAULT 'UNKNOWN',
    "birthDate" DATE,
    "status" "PetStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "serialNumber" VARCHAR(80) NOT NULL,
    "modelCode" VARCHAR(80),
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_device_bindings" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "boundByUserId" TEXT NOT NULL,
    "boundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unboundAt" TIMESTAMP(3),

    CONSTRAINT "pet_device_bindings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "households_createdById_createdAt_idx" ON "households"("createdById", "createdAt");

-- CreateIndex
CREATE INDEX "household_members_userId_joinedAt_idx" ON "household_members"("userId", "joinedAt");

-- CreateIndex
CREATE INDEX "pets_householdId_status_createdAt_idx" ON "pets"("householdId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "pets_createdByUserId_createdAt_idx" ON "pets"("createdByUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "devices_serialNumber_key" ON "devices"("serialNumber");

-- CreateIndex
CREATE INDEX "devices_status_registeredAt_idx" ON "devices"("status", "registeredAt");

-- CreateIndex
CREATE INDEX "pet_device_bindings_deviceId_unboundAt_idx" ON "pet_device_bindings"("deviceId", "unboundAt");

-- CreateIndex
CREATE INDEX "pet_device_bindings_petId_unboundAt_idx" ON "pet_device_bindings"("petId", "unboundAt");

-- CreateIndex
CREATE INDEX "pet_device_bindings_boundByUserId_boundAt_idx" ON "pet_device_bindings"("boundByUserId", "boundAt");

-- AddForeignKey
ALTER TABLE "households" ADD CONSTRAINT "households_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_device_bindings" ADD CONSTRAINT "pet_device_bindings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_device_bindings" ADD CONSTRAINT "pet_device_bindings_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_device_bindings" ADD CONSTRAINT "pet_device_bindings_boundByUserId_fkey" FOREIGN KEY ("boundByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
