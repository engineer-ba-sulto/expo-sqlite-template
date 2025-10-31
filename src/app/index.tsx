import TodoForm from "@/components/TodoForm";
import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import createTodo from "@/lib/todo";
import { CreateTodoInput } from "@/types/todo";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const { data } = useLiveQuery(db.select().from(todoTable));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: CreateTodoInput) => {
    setIsLoading(true);
    try {
      await createTodo(input);
    } catch (err) {
      console.error("Todo登録エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-3xl font-bold text-blue-500 mb-8">
          Welcome to Nativewind!
        </Text>

        <TodoForm onSubmit={handleSubmit} isLoading={isLoading} />

        <View className="mt-8 w-full">
          <Text className="text-xl font-semibold mb-4">Todo一覧</Text>
          {data && data.length > 0 ? (
            data.map((todo) => (
              <View key={todo.id} className="p-4 border-b border-gray-200">
                <Text className="text-lg font-medium">{todo.title}</Text>
                <Text className="text-gray-600">{todo.description}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500">Todoがありません</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
