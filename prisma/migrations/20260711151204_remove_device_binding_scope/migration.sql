/*
  Warnings:

  - You are about to drop the `devices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pet_device_bindings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pet_device_bindings" DROP CONSTRAINT "pet_device_bindings_boundByUserId_fkey";

-- DropForeignKey
ALTER TABLE "pet_device_bindings" DROP CONSTRAINT "pet_device_bindings_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "pet_device_bindings" DROP CONSTRAINT "pet_device_bindings_petId_fkey";

-- DropTable
DROP TABLE "devices";

-- DropTable
DROP TABLE "pet_device_bindings";

-- DropEnum
DROP TYPE "DeviceStatus";
