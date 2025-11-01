import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import createTodo, { deleteTodo, updateTodo } from "@/lib/todo";
import { CreateTodoInput, UpdateTodoInput } from "@/types/todo";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

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

  const handleUpdate = async (input: UpdateTodoInput) => {
    try {
      await updateTodo(input);
    } catch (err) {
      console.error("Todo更新エラー:", err);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("削除の確認", "このTodoを削除しますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(id);
          } catch (err) {
            console.error("Todo削除エラー:", err);
            Alert.alert("エラー", "Todoの削除に失敗しました");
          }
        },
      },
    ]);
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
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Text className="text-gray-500">Todoがありません</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
