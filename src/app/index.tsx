import db from "@/drizzle/db";
import { todoTable } from "@/drizzle/schema/todoSchema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Text, View } from "react-native";

export default function Index() {
  const { data } = useLiveQuery(db.select().from(todoTable));
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}
