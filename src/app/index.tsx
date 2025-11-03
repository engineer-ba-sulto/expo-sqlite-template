import TodoForm from "@/components/todo/TodoForm";
import TodoItem from "@/components/todo/TodoItem";
import Calendar from "@/components/ui/Calendar";
import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import useCalendarTodos from "@/hooks/useCalendarTodos";
import createTodo, { deleteTodo, updateTodo } from "@/lib/todo";
import { CreateTodoInput, UpdateTodoInput } from "@/types/todo";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const { data } = useLiveQuery(db.select().from(todoTable));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // カレンダー用のTODO処理
  const { markedDates, filteredTodos } = useCalendarTodos(
    data || [],
    selectedDate
  );

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

        {/* カレンダーコンポーネント */}
        <View className="mt-8 w-full">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold">カレンダー</Text>
            {selectedDate && (
              <TouchableOpacity
                onPress={() => setSelectedDate(undefined)}
                className="px-3 py-1 bg-gray-200 rounded-lg"
              >
                <Text className="text-sm text-gray-700">選択解除</Text>
              </TouchableOpacity>
            )}
          </View>
          <Calendar
            markedDates={markedDates}
            onDayPress={(date) => setSelectedDate(date)}
            selectedDate={selectedDate}
          />
        </View>

        {/* TODO一覧 */}
        <View className="mt-8 w-full">
          <Text className="text-xl font-semibold mb-4">
            {selectedDate
              ? `${selectedDate.getFullYear()}年${
                  selectedDate.getMonth() + 1
                }月${selectedDate.getDate()}日のTodo一覧`
              : "Todo一覧"}
          </Text>
          {filteredTodos && filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Text className="text-gray-500">
              {selectedDate
                ? "この日に作成されたTodoがありません"
                : "Todoがありません"}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
