-- AlterTable
ALTER TABLE "dogs" ALTER COLUMN "tier" DROP NOT NULL,
ALTER COLUMN "tier" SET DEFAULT 'Standard',
ALTER COLUMN "status" SET DEFAULT 'pending';
