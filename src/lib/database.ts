// src/lib/database.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// Export all tables for easy import
export * from '../../drizzle/schema';