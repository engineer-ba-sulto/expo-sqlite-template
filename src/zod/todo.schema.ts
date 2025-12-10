import { z } from "zod";

export const todoSchema = z.object({
  id: z.number().int().positive("IDは正の整数である必要があります"),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z.string().min(1, "説明は必須です").max(500, "説明は500文字以内で入力してください"),
});

export const createTodoSchema = todoSchema.omit({ id: true });
