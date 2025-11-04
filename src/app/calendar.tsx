import TodoItem from "@/components/todo/TodoItem";
import Calendar from "@/components/ui/Calendar";
import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import useCalendarTodos from "@/hooks/useCalendarTodos";
import { deleteTodo, updateTodo } from "@/lib/todo";
import { UpdateTodoInput } from "@/types/todo";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarPage() {
  const { success, error } = useMigrations(db, migrations);
  const { data } = useLiveQuery(db.select().from(todoTable));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // カレンダー用のTODO処理
  const { markedDates, filteredTodos } = useCalendarTodos(
    data || [],
    selectedDate
  );

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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        {/* カレンダーコンポーネント */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-blue-500">カレンダー</Text>
            {selectedDate && (
              <TouchableOpacity
                onPress={() => setSelectedDate(undefined)}
                className="px-3 py-1 bg-gray-200 rounded-lg active:bg-gray-300"
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
        <ScrollView className="mt-4">
          <Text className="text-xl font-semibold mb-4">
            {selectedDate
              ? `${selectedDate.getFullYear()}年${
                  selectedDate.getMonth() + 1
                }月${selectedDate.getDate()}日のTodo一覧`
              : "日付を選択してTodoを確認"}
          </Text>
          {selectedDate ? (
            filteredTodos && filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-500 text-center">
                  この日に作成されたTodoがありません
                </Text>
              </View>
            )
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 text-center">
                カレンダーから日付を選択してください
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
