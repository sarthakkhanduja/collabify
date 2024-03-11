import { Client } from "pg";
require("dotenv").config();

export async function getClient() {
  const client = new Client(process.env.POSTGRES_CONNECTION_STRING);
  await client.connect();
  return client;
}
