import type { z } from "zod";
import type { createTodoSchema, todoSchema } from "@/zod/todo.schema";

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof todoSchema>;
