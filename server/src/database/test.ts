import { getClient } from "./utils";

async function createTable() {
  const client = await getClient();
  const createTableQuery = `
        CREATE TABLE test(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `;

  await client.query(createTableQuery);
  console.log("Table created successfully");
}

createTable();
