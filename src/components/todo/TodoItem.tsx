import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import type { UpdateTodoInput } from "@/types/todo";
import { todoSchema } from "@/zod/todo.schema";

interface TodoItemProps {
  todo: {
    id: number;
    title: string;
    description: string;
  };
  onUpdate: (input: UpdateTodoInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      id: todo.id,
      title: todo.title,
      description: todo.description,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      id: todo.id,
      title: todo.title,
      description: todo.description,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      id: todo.id,
      title: todo.title,
      description: todo.description,
    });
  };

  const handleSave = async (data: UpdateTodoInput) => {
    setIsLoading(true);
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (err) {
      console.error("Todo更新エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <View className="p-4 border-b border-gray-200 bg-gray-50">
        <View className="mb-3">
          <Text className="text-sm font-medium text-gray-700 mb-2">タイトル</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Todoのタイトルを入力"
                editable={!isLoading}
              />
            )}
          />
          {errors.title && (
            <Text className="text-red-500 text-sm mt-1">{errors.title.message}</Text>
          )}
        </View>

        <View className="mb-3">
          <Text className="text-sm font-medium text-gray-700 mb-2">説明</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Todoの説明を入力"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isLoading}
              />
            )}
          />
          {errors.description && (
            <Text className="text-red-500 text-sm mt-1">{errors.description.message}</Text>
          )}
        </View>

        <View className="flex-row gap-2 mt-2">
          <View className="flex-1">
            <Button
              title={isLoading ? "保存中..." : "保存"}
              onPress={handleSubmit(handleSave)}
              disabled={isLoading}
            />
          </View>
          <View className="flex-1">
            <Button
              title="キャンセル"
              variant="secondary"
              onPress={handleCancel}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="p-4 border-b border-gray-200">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-medium">{todo.title}</Text>
          <Text className="text-gray-600 mt-1">{todo.description}</Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleEdit}
            className="px-3 py-1.5 bg-blue-500 rounded-lg active:bg-blue-600"
          >
            <Text className="text-white text-sm font-medium">編集</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(todo.id)}
            className="px-3 py-1.5 bg-red-500 rounded-lg active:bg-red-600"
          >
            <Text className="text-white text-sm font-medium">削除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
