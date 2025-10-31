import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z
    .string()
    .min(1, "説明は必須です")
    .max(500, "説明は500文字以内で入力してください"),
});
