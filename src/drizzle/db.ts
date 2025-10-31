import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as userSchema from "./schema/todoSchema";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb, { schema: userSchema });

export default db;
