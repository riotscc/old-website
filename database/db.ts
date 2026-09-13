import { Pool } from "pg";

const connectionString = process.env.POSTEGRESQL_URL;

if (!connectionString) {
    throw new Error(
        "POSTEGRESQL_URL is missing in .env"
    );
}

export const db = new Pool({
    connectionString,
});