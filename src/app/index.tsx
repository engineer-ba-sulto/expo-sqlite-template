import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Text, View } from "react-native";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const { data } = useLiveQuery(db.select().from(todoTable));

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Text className="text-2xl text-gray-500">
        Data:{JSON.stringify(data)}
      </Text>
    </View>
  );
}
