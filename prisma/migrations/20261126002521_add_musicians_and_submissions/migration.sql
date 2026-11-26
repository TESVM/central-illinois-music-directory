-- CreateEnum
CREATE TYPE "SuggestedChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'REVIEWER', 'SUPPORT', 'EDITOR', 'CHURCH_OWNER', 'CHURCH_EDITOR');

-- CreateEnum
CREATE TYPE "ClaimRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'MORE_INFO', 'DENIED');

-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('DOMAIN_EMAIL', 'PUBLIC_PHONE', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "PublicationState" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationState" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "SubmissionKind" AS ENUM ('CONTACT', 'MUSICIAN_PROFILE', 'CHURCH_LISTING', 'GIG_REQUEST');

-- CreateEnum
CREATE TYPE "TriageState" AS ENUM ('NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED');

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Church" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "denomination" TEXT,
    "description" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "websiteUrl" TEXT,
    "appUrl" TEXT,
    "livestreamUrl" TEXT,
    "logoUrl" TEXT,
    "featuredImageUrl" TEXT,
    "seniorPastorId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "lastScannedAt" TIMESTAMP(3),
    "lastUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pastor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "churchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pastor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTime" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ministry" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuggestedChange" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "sourceUrl" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "status" "SuggestedChangeStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuggestedChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "churchName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "message" TEXT,
    "submittedDataJson" JSONB NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimRequest" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "userId" TEXT,
    "applicantName" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantRole" TEXT NOT NULL,
    "verificationMethod" "VerificationMethod" NOT NULL,
    "evidenceSummary" TEXT NOT NULL,
    "status" "ClaimRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchMembership" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "grantedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateLog" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "performedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpdateLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Musician" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "primaryRole" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "churchExperience" TEXT,
    "shortBio" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "hourlyRate" INTEGER NOT NULL,
    "instruments" TEXT[],
    "genres" TEXT[],
    "churchTypes" TEXT[],
    "churches" TEXT[],
    "events" TEXT[],
    "media" TEXT[],
    "availability" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "showPhone" BOOLEAN NOT NULL DEFAULT false,
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "showWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "showSocials" BOOLEAN NOT NULL DEFAULT false,
    "example" BOOLEAN NOT NULL DEFAULT false,
    "state" "PublicationState" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "distanceMiles" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Musician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "kind" "SubmissionKind" NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "organization" TEXT,
    "payload" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "notification" "NotificationState" NOT NULL DEFAULT 'PENDING',
    "notificationError" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "notifyAttempts" INTEGER NOT NULL DEFAULT 0,
    "triage" "TriageState" NOT NULL DEFAULT 'NEW',
    "staffNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Church_slug_key" ON "Church"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Church_seniorPastorId_key" ON "Church"("seniorPastorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchMembership_churchId_userId_key" ON "ChurchMembership"("churchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Musician_slug_key" ON "Musician"("slug");

-- CreateIndex
CREATE INDEX "Musician_state_example_idx" ON "Musician"("state", "example");

-- CreateIndex
CREATE INDEX "Musician_city_idx" ON "Musician"("city");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_dedupeKey_key" ON "FormSubmission"("dedupeKey");

-- CreateIndex
CREATE INDEX "FormSubmission_kind_triage_idx" ON "FormSubmission"("kind", "triage");

-- CreateIndex
CREATE INDEX "FormSubmission_notification_idx" ON "FormSubmission"("notification");

-- CreateIndex
CREATE INDEX "FormSubmission_createdAt_idx" ON "FormSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "Church" ADD CONSTRAINT "Church_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Church" ADD CONSTRAINT "Church_seniorPastorId_fkey" FOREIGN KEY ("seniorPastorId") REFERENCES "Pastor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pastor" ADD CONSTRAINT "Pastor_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTime" ADD CONSTRAINT "ServiceTime_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministry" ADD CONSTRAINT "Ministry_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedChange" ADD CONSTRAINT "SuggestedChange_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimRequest" ADD CONSTRAINT "ClaimRequest_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimRequest" ADD CONSTRAINT "ClaimRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchMembership" ADD CONSTRAINT "ChurchMembership_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchMembership" ADD CONSTRAINT "ChurchMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateLog" ADD CONSTRAINT "UpdateLog_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;
