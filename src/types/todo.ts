import { createTodoSchema } from "@/zod/todo.schema";
import { z } from "zod";

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
