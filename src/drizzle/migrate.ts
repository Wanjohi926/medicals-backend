import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import db, { client } from "./db";

async function migration() {
  console.log("......Migrations Started......");

  await migrate(db, {
    migrationsFolder: __dirname + "/migrations", // adjust if using different path
  });

  await client.end(); // ends pool connection
  console.log("......Migrations Completed......");

  process.exit(0);
}

migration().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
