/* eslint-disable no-console */
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
export const todoRepository = {
    get,
};

//schema / model
interface Todo {
    id: string;
    content: string;
    date: Date;
    done: boolean;
}

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
                    date: new Date(date),
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
