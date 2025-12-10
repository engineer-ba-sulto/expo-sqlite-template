import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import type { CreateTodoInput } from "@/types/todo";
import { createTodoSchema } from "@/zod/todo.schema";

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void | Promise<void>;
  isLoading?: boolean;
}

export default function TodoForm({ onSubmit, isLoading = false }: TodoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data: CreateTodoInput) => {
    await onSubmit(data);
    reset();
  };

  return (
    <View className="w-full p-4 gap-4">
      <View>
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
            />
          )}
        />
        {errors.title && <Text className="text-red-500 text-sm mt-1">{errors.title.message}</Text>}
      </View>

      <View>
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
            />
          )}
        />
        {errors.description && (
          <Text className="text-red-500 text-sm mt-1">{errors.description.message}</Text>
        )}
      </View>

      <Button
        title={isLoading ? "登録中..." : "登録"}
        onPress={handleSubmit(handleFormSubmit)}
        disabled={isLoading}
      />
    </View>
  );
}
