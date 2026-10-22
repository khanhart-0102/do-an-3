import dotenv from "dotenv";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import path from "node:path";
import { Client } from "pg";

dotenv.config({ path: ".env.local" });

async function setupDemoDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from .env.local");
  }

  const parsedUrl = new URL(databaseUrl);
  const databaseName = decodeURIComponent(parsedUrl.pathname.replace(/^\//, ""));
  if (!databaseName) {
    throw new Error("DATABASE_URL must include a database name");
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const result = await client.query<{ count: string }>(
      `SELECT count(*)::text AS count
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    const tableCount = Number(result.rows[0]?.count ?? 0);

    if (tableCount !== 0) {
      throw new Error(
        `Refusing to initialize "${databaseName}": it already contains ${tableCount} public tables. ` +
          "Create a separate, empty demo database. No schema or data was changed."
      );
    }

    const terminal = createInterface({ input: stdin, output: stdout });
    try {
      const confirmation = await terminal.question(
        `This will create the Lingo schema in the EMPTY database "${databaseName}". ` +
          "Type the database name to continue: "
      );
      if (confirmation !== databaseName) {
        throw new Error("Database name did not match. No schema or data was changed.");
      }
    } finally {
      terminal.close();
    }
  } finally {
    await client.end();
  }

  const drizzleCli = path.resolve("node_modules", "drizzle-kit", "bin.cjs");
  const push = spawnSync(process.execPath, [drizzleCli, "push"], {
    stdio: "inherit",
    env: process.env,
  });
  if (push.error) {
    throw push.error;
  }
  if (push.status !== 0) {
    throw new Error(`Drizzle schema setup failed with exit code ${push.status}`);
  }

  const tsxCli = path.resolve("node_modules", "tsx", "dist", "cli.mjs");
  const seed = spawnSync(process.execPath, [tsxCli, "scripts/seed-demo-data.ts"], {
    stdio: "inherit",
    env: process.env,
  });
  if (seed.error) {
    throw seed.error;
  }
  if (seed.status !== 0) {
    throw new Error(`Demo data setup failed with exit code ${seed.status}`);
  }

  console.log("Demo database initialized. No existing tables were modified.");
}

setupDemoDatabase().catch((error: unknown) => {
  console.error(
    "Demo database setup stopped:",
    error instanceof Error ? error.message : String(error)
  );
  process.exitCode = 1;
});
