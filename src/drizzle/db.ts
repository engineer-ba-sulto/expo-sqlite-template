import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { DB_CONFIG } from "@/constants/db";
import * as todoSchema from "./schema/todoSchema";

// データベースファイルを開く
const expoDb = openDatabaseSync(DB_CONFIG.fileName, {
  enableChangeListener: DB_CONFIG.enableChangeListener,
});

// Drizzle ORMインスタンスを作成
const db = drizzle(expoDb, { schema: todoSchema });

export default db;
