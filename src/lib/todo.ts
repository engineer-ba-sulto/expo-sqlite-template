import db from "@/drizzle/db";
import { todoTable } from "@/drizzle/schema/todoSchema";
import { CreateTodoInput, UpdateTodoInput } from "@/types/todo";
import { eq } from "drizzle-orm";

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

export async function updateTodo(input: UpdateTodoInput) {
  const result = await db
    .update(todoTable)
    .set({
      title: input.title,
      description: input.description,
      updatedAt: new Date(),
    })
    .where(eq(todoTable.id, input.id))
    .returning();

  return result[0];
}

export async function deleteTodo(id: number) {
  await db.delete(todoTable).where(eq(todoTable.id, id));
}
