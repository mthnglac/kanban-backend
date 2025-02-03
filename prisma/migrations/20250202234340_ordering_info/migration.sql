-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlowNode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardNodeId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "FlowNode_boardNodeId_fkey" FOREIGN KEY ("boardNodeId") REFERENCES "BoardNode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FlowNode" ("boardNodeId", "createdAt", "description", "id", "title") SELECT "boardNodeId", "createdAt", "description", "id", "title" FROM "FlowNode";
DROP TABLE "FlowNode";
ALTER TABLE "new_FlowNode" RENAME TO "FlowNode";
CREATE TABLE "new_TaskNode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flowNodeId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TaskNode_flowNodeId_fkey" FOREIGN KEY ("flowNodeId") REFERENCES "FlowNode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TaskNode" ("createdAt", "description", "flowNodeId", "id", "progress", "title") SELECT "createdAt", "description", "flowNodeId", "id", "progress", "title" FROM "TaskNode";
DROP TABLE "TaskNode";
ALTER TABLE "new_TaskNode" RENAME TO "TaskNode";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
