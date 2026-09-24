-- CreateTable
CREATE TABLE "Niche" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SolutionType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "defaultPrice" REAL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "googleMapsUrl" TEXT,
    "source" TEXT NOT NULL DEFAULT 'INSTAGRAM',
    "nicheId" TEXT NOT NULL,
    "solutionTypeId" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'NOVO',
    "proposedValue" REAL,
    "soldValue" REAL,
    "soldAt" DATETIME,
    "lostReason" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lead_solutionTypeId_fkey" FOREIGN KEY ("solutionTypeId") REFERENCES "SolutionType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'OUTBOUND',
    "channel" TEXT NOT NULL DEFAULT 'INSTAGRAM_DM',
    "occurredAt" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "outcome" TEXT,
    "followUpAt" DATETIME,
    "followUpDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Niche_name_key" ON "Niche"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SolutionType_name_key" ON "SolutionType"("name");
