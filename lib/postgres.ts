import { Pool } from "pg";

const postgresUrl = process.env.POSTEGRESQL_URL;

if (!postgresUrl) {
  throw new Error(
    "POSTEGRESQL_URL is missing from your environment variables.",
  );
}

const globalForPostgres = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

function createPool(): Pool {
  return new Pool({
    connectionString: postgresUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

export function connectPostgres(): Pool {
  const existingPool = globalForPostgres.postgresPool;

  if (existingPool && !(existingPool as Pool & { ended?: boolean }).ended) {
    return existingPool;
  }

  const newPool = createPool();

  globalForPostgres.postgresPool = newPool;

  return newPool;
}

export default connectPostgres;