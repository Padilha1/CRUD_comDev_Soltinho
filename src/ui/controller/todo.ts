import { todoRepository } from "@ui/repository.ts/todo";

interface TodoControllerGetParams {
    page: number;
}
async function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 2,
    });
}

export const todoController = {
    get,
};
