-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "guestEmail" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "orders_guestEmail_idx" ON "orders"("guestEmail");
