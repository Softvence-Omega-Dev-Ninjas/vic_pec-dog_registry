-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "emailNotify" BOOLEAN NOT NULL DEFAULT true,
    "newRegistrations" BOOLEAN NOT NULL DEFAULT true,
    "certificateRequests" BOOLEAN NOT NULL DEFAULT true,
    "reportAlerts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "certificateCode" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "issueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dogs" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "pcrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "microchip" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dog_breed_analyses" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dog_breed_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dog_healths" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "healthStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dog_healths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dog_medias" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "fileUrlId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dog_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_instances" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownerCode" TEXT NOT NULL,
    "about" TEXT,
    "isAmbassador" BOOLEAN NOT NULL DEFAULT false,
    "emailNotify" BOOLEAN NOT NULL DEFAULT true,
    "showOwnerInfo" BOOLEAN NOT NULL DEFAULT true,
    "coverImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_requests" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "reporterName" TEXT NOT NULL,
    "reporterEmail" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "userType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "profileImageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_settings_adminId_key" ON "admin_settings"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateCode_key" ON "certificates"("certificateCode");

-- CreateIndex
CREATE UNIQUE INDEX "dogs_pcrId_key" ON "dogs"("pcrId");

-- CreateIndex
CREATE UNIQUE INDEX "dogs_microchip_key" ON "dogs"("microchip");

-- CreateIndex
CREATE UNIQUE INDEX "owners_userId_key" ON "owners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "owners_ownerCode_key" ON "owners"("ownerCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_settings" ADD CONSTRAINT "admin_settings_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dog_breed_analyses" ADD CONSTRAINT "dog_breed_analyses_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dog_healths" ADD CONSTRAINT "dog_healths_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dog_medias" ADD CONSTRAINT "dog_medias_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dog_medias" ADD CONSTRAINT "dog_medias_fileUrlId_fkey" FOREIGN KEY ("fileUrlId") REFERENCES "file_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "file_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_requests" ADD CONSTRAINT "registration_requests_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_requests" ADD CONSTRAINT "registration_requests_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "file_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
