import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useState } from "react";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoForm from "@/components/todo/TodoForm";
import TodoItem from "@/components/todo/TodoItem";
import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import createTodo, { deleteTodo, updateTodo } from "@/lib/todo";
import type { CreateTodoInput, UpdateTodoInput } from "@/types/todo";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const { data } = useLiveQuery(db.select().from(todoTable));
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = async (input: CreateTodoInput) => {
    setIsLoading(true);
    try {
      await createTodo(input);
      setIsModalVisible(false);
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-blue-500">Todo一覧</Text>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className="px-4 py-2 bg-blue-500 rounded-lg active:bg-blue-600"
          >
            <Text className="text-white font-semibold">新規作成</Text>
          </TouchableOpacity>
        </View>

        {/* TODO一覧 */}
        <ScrollView className="flex-1">
          <View className="mt-4">
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
              <View className="items-center justify-center py-8">
                <Text className="text-gray-500 text-center">Todoがありません</Text>
                <Text className="text-gray-400 text-sm mt-2">
                  右上の「新規作成」ボタンから追加してください
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Todo登録モーダル */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setIsModalVisible(false)}
          />
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold">新しいTodoを作成</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="px-3 py-1">
                <Text className="text-blue-500 font-semibold">閉じる</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TodoForm onSubmit={handleSubmit} isLoading={isLoading} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
