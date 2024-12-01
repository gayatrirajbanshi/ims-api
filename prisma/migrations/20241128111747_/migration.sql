-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('retail', 'wholesale');

-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL DEFAULT 'retail',
    "address" TEXT,
    "phone" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_name_key" ON "organization"("name");
