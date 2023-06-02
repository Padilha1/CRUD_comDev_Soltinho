import { HttpNotFoundError } from "@server/infra/errors";
import { Todo, TodoSchema } from "@server/schema/todo";
import { supabase } from "@server/infra/db/supabase";
interface TodoRepositoryGetParams {
    page?: number;
    limit?: number;
}
interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

async function get({
    page,
    limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const startIndex = (currentPage - 1) * currentLimit;
    const endIndex = currentPage * currentLimit - 1;

    const { data, error, count } = await supabase
        .from("Todos")
        .select("*", {
            count: "exact",
        })
        .order("date", { ascending: false })
        .range(startIndex, endIndex);
    if (error) throw new Error("Failed to fetch data from supabase");

    const parsedData = TodoSchema.array().safeParse(data);

    if (!parsedData.success) {
        throw parsedData.error;
    }
    const todos = parsedData.data;
    const total = count || todos.length;
    const totalPages = Math.ceil(total / currentLimit);

    return {
        todos,
        total,
        pages: totalPages,
    };
}

async function createByContent(content: string): Promise<Todo> {
    const { data, error } = await supabase
        .from("Todos")
        .insert([
            {
                content,
            },
        ])
        .select()
        .single();
    if (error) throw new Error("Failed to Created Todo");

    const parsedData = TodoSchema.parse(data);

    return parsedData;
}
// const newTodo = create(content);
// return newTodo;

async function getTodoById(id: string): Promise<Todo> {
    const { data, error } = await supabase
        .from("Todos")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw new Error("Failed to get todo by id");
    const parsedData = TodoSchema.safeParse(data);
    if (!parsedData.success) throw new Error("Failed to parse Todo created!");
    return parsedData.data;
}

async function toggleDone(id: string): Promise<Todo> {
    const todo = await getTodoById(id);
    const { data, error } = await supabase
        .from("Todos")
        .update({
            done: !todo.done,
        })
        .eq("id", id)
        .select()
        .single();
    if (error) throw new Error("Failed to get Todo by id");
    const parsedData = TodoSchema.safeParse(data);
    if (!parsedData.success) throw new Error("Failed to return updated todo");

    return parsedData.data;
    // const ALL_TODOS = read();
    // const todo = ALL_TODOS.find((todo) => todo.id === id);
    // if (!todo) throw new Error(`Todo with id ${id} not found`);
    // const updatedTodo = update(todo.id, {
    //     done: !todo.done,
    // });
    // return updatedTodo;
}

async function deleteById(id: string) {
    const { error } = await supabase.from("Todos").delete().match({ id });
    if (error) throw new HttpNotFoundError(`Todo with id ${id} not found`);
    // const ALL_TODOS = read();
    // const todo = ALL_TODOS.find((todo) => todo.id === id);
    // if (!todo) throw new HttpNotFoundError(`Todo with id ${id} not found`);
    // dbDeleteById(id);
}

export const todoRepository = {
    get,
    createByContent,
    toggleDone,
    deleteById,
};
