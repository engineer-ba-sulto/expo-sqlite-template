import db from "@/drizzle/db";
import { todoTable } from "@/drizzle/schema/todoSchema";
import { CreateTodoInput } from "@/types/todo";

export default async function createTodo(input: CreateTodoInput) {
  const result = await db
    .insert(todoTable)
    .values({
      title: input.title,
      description: input.description,
    })
    .returning();

  return result[0];
}
