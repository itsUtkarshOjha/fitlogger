/*
  Warnings:

  - Added the required column `updatedAt` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Weights` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Styles" AS ENUM ('Strength', 'Cardio', 'Flexibility');

-- CreateEnum
CREATE TYPE "Movement" AS ENUM ('Push', 'Pull', 'Isolation', 'Compound');

-- CreateEnum
CREATE TYPE "Muscles" AS ENUM ('Chest', 'Biceps', 'Triceps', 'Back', 'Shoulders', 'Legs', 'Core');

-- AlterTable
ALTER TABLE "Exercises" ADD COLUMN     "duration" DOUBLE PRECISION,
ADD COLUMN     "movementType" "Movement",
ADD COLUMN     "muscleGroup" "Muscles",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "trainingStyle" "Styles",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Weights" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
