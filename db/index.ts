import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || "";

// Disable prefetch as it is not supported for Supabase "Transaction" pool mode (port 6543)
// Use connect_timeout and idle_timeout to avoid hanging serverless functions
const client = connectionString
  ? postgres(connectionString, {
      prepare: false,
      ssl: connectionString.includes("localhost") ? false : "require",
      connect_timeout: 8,
      idle_timeout: 10,
      max: 1,
    })
  : null;

export const db = client ? drizzle(client, { schema }) : (null as any);
export const hasDatabaseConnection = Boolean(connectionString);

