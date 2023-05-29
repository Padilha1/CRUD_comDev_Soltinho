import { todoRepository } from "@ui/repository.ts/todo";
import { Todo } from "@ui/schema/todo";

interface TodoControllerGetParams {
    page: number;
}
async function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    });
}

function filterTodosByContent<Todo>(
    todos: Array<Todo & { content: string }>,
    search: string
): Todo[] {
    const homeTodos = todos.filter((todo) => {
        const searchNormalized = search.toLowerCase();
        const contentNormalized = todo.content.toLowerCase();
        return contentNormalized.includes(searchNormalized);
    });

    return homeTodos;
}

interface TodoControllerCreateParams {
    content?: string;
    onError: () => void;
    onSuccess: (todo: Todo) => void;
}
function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
    if (!content) {
        onError();
        return;
    }

    todoRepository
        .createByContent(content)
        .then((newTodo) => {
            onSuccess(newTodo);
        })
        .catch(() => {
            onError();
        });
}

interface TodoControllerToggleDoneParams {
    id: string;
    updateTodoOnScreen: () => void;
}

function toggleDone({
    id,
    updateTodoOnScreen,
}: TodoControllerToggleDoneParams) {
    todoRepository.toggleDone(id).then(() => {
        updateTodoOnScreen();
    });
}

export const todoController = {
    get,
    filterTodosByContent,
    create,
    toggleDone,
};
