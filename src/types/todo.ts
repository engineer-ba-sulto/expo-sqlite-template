import { createTodoSchema, todoSchema } from "@/zod/todo.schema";
import { z } from "zod";

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof todoSchema>;
