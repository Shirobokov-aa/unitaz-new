// import "dotenv/config";
import { config } from 'dotenv'
config()
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 5,
});

const db = drizzle({ client: pool, schema: schema });

export { db };
