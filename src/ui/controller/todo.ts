async function get() {
    return fetch("/api/todos").then(async (resServer) => {
        const todoString = await resServer.text();
        const todosFromServer = JSON.parse(todoString).todos;
        // todos = [...todosFromServer];
        return todosFromServer;
    });
}

export const todoController = {
    get,
};
