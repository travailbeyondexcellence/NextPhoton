/*
  Warnings:

  - You are about to drop the column `studentId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `learnerId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educatorId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learnerId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE', 'INTERN', 'EDUCATOR', 'LEARNER', 'GUARDIAN', 'USER');

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "studentId",
ADD COLUMN     "learnerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "teacherId",
ADD COLUMN     "educatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "studentId",
ADD COLUMN     "learnerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "_SubjectToTeacher";

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intern" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Intern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educator" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT NOT NULL,
    "sex" "UserSex" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Educator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Learner" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT NOT NULL,
    "sex" "UserSex" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guardianId" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetterAuthAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "BetterAuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetterAuthSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BetterAuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetterAuthUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "BetterAuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetterAuthVerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_EducatorToSubject" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_username_key" ON "Intern"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_email_key" ON "Intern"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_phone_key" ON "Intern"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Educator_username_key" ON "Educator"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Educator_email_key" ON "Educator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Educator_phone_key" ON "Educator"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Learner_username_key" ON "Learner"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Learner_email_key" ON "Learner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Learner_phone_key" ON "Learner"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_username_key" ON "Guardian"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_email_key" ON "Guardian"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_phone_key" ON "Guardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "BetterAuthAccount_provider_providerAccountId_key" ON "BetterAuthAccount"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "BetterAuthSession_sessionToken_key" ON "BetterAuthSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "BetterAuthUser_email_key" ON "BetterAuthUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BetterAuthVerificationToken_token_key" ON "BetterAuthVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "BetterAuthVerificationToken_identifier_token_key" ON "BetterAuthVerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_EducatorToSubject_AB_unique" ON "_EducatorToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_EducatorToSubject_B_index" ON "_EducatorToSubject"("B");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_id_fkey" FOREIGN KEY ("id") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intern" ADD CONSTRAINT "Intern_id_fkey" FOREIGN KEY ("id") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educator" ADD CONSTRAINT "Educator_id_fkey" FOREIGN KEY ("id") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_id_fkey" FOREIGN KEY ("id") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_id_fkey" FOREIGN KEY ("id") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Educator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetterAuthAccount" ADD CONSTRAINT "BetterAuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetterAuthSession" ADD CONSTRAINT "BetterAuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BetterAuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EducatorToSubject" ADD CONSTRAINT "_EducatorToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Educator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EducatorToSubject" ADD CONSTRAINT "_EducatorToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
