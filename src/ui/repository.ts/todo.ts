/* eslint-disable no-console */
import { Todo, TodoSchema } from "@ui/schema/todo";
import { z as schema } from "zod";
interface TodoRepositoryGetParams {
    page: number;
    limit: number;
}
interface TodoRepositoryGetOutput {
    todos: Todo[];
    pages: number;
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (resServer) => {
            const todoString = await resServer.text();
            const responseParsed = parseTodosFromServer(JSON.parse(todoString));

            return {
                total: responseParsed.total,
                todos: responseParsed.todos,
                pages: responseParsed.pages,
            };
        }
    );
}

export async function createByContent(content: string): Promise<Todo> {
    const response = await fetch("api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
        }),
    });

    if (response.ok) {
        const serverResposnse = await response.json();
        const ServerResponseSchema = schema.object({
            todo: TodoSchema,
        });
        const serverResponseParsed =
            ServerResponseSchema.safeParse(serverResposnse);
        if (!serverResponseParsed.success) {
            throw new Error("Failed to created TODO: (");
        }
        const todo = serverResponseParsed.data.todo;
        return todo;
    }

    throw new Error("Failed to create new Todo");
}

export const todoRepository = {
    get,
    createByContent,
};

//schema / model
// interface Todo {
//     id: string;
//     content: string;
//     date: Date;
//     done: boolean;
// }

function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("invalid todo from API");
                }

                const { id, content, done, date } = todo as {
                    id: string;
                    content: string;
                    date: string;
                    done: string;
                };

                return {
                    id,
                    content,
                    done: String(done).toLowerCase() === "true",
                    date: date,
                };
            }),
        };
    }
    return {
        pages: 1,
        total: 0,
        todos: [],
    };
}
