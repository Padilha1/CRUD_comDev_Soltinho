/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import { todoController } from "@ui/controller/todo";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import React from "react";

interface HomeTodo {
    id: string;
    content: string;
}

export default function HomePage() {
    const initialLoadComplete = React.useRef(false);
    const [newTodoContent, setNewTodoContent] = React.useState("");
    const [totalPages, setTotalPages] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [todos, setTodos] = React.useState<HomeTodo[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");
    const homeTodos = todoController.filterTodosByContent<HomeTodo>(
        todos,
        search
    );
    const hasMorePages = totalPages > page;
    const hasNoTodos = homeTodos.length === 0 && !isLoading;

    React.useEffect(() => {
        if (!initialLoadComplete.current) {
            todoController
                .get({ page })
                .then(({ todos, pages }) => {
                    setTodos(todos);
                    setTotalPages(pages);
                })
                .finally(() => {
                    setIsLoading(false);
                    initialLoadComplete.current = true;
                });
        }
    }, []);

    return (
        <main>
            <GlobalStyles themeName="indigo" />
            <header
                style={{
                    backgroundImage: `url(/bg.jpg)`,
                }}
            >
                <div className="typewriter">
                    <h1>Qual Anime adicionar a lista?</h1>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        todoController.create({
                            content: newTodoContent,
                            onSuccess(todo: HomeTodo) {
                                setTodos((oldTodos) => {
                                    return [todo, ...oldTodos];
                                });
                                setNewTodoContent("");
                            },
                            onError() {
                                alert(
                                    "Voce precisa de um conteudo para criar!"
                                );
                            },
                        });
                    }}
                >
                    <input
                        type="text"
                        placeholder="Kimetsu no Yaiba..."
                        value={newTodoContent}
                        onChange={function newTodoHandler(event) {
                            setNewTodoContent(event.target.value);
                        }}
                    />
                    <button type="submit" aria-label="Adicionar novo item">
                        +
                    </button>
                </form>
            </header>

            <section>
                <form>
                    <input
                        type="text"
                        placeholder=" Filtrar lista atual"
                        onChange={function handleSearch(event) {
                            setSearch(event.target.value);
                        }}
                    />
                </form>

                <table border={1}>
                    <thead>
                        <tr>
                            <th align="left">
                                <input type="checkbox" disabled />
                            </th>
                            <th align="left">Id</th>
                            <th align="left">Conteúdo</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {homeTodos.map((currentTodo) => {
                            return (
                                <tr key={currentTodo.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{currentTodo.id.substring(0, 4)}</td>
                                    <td>{currentTodo.content}</td>
                                    <td align="right">
                                        <button data-type="delete">
                                            Apagar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    Carregando...
                                </td>
                            </tr>
                        )}

                        {hasNoTodos && (
                            <tr>
                                <td colSpan={4} align="center">
                                    Nenhum item encontrado
                                </td>
                            </tr>
                        )}

                        {hasMorePages && (
                            <tr>
                                <td
                                    colSpan={4}
                                    align="center"
                                    style={{ textAlign: "center" }}
                                >
                                    <button
                                        data-type="load-more"
                                        onClick={() => {
                                            setIsLoading(true);
                                            const nextPage = page + 1;
                                            setPage(nextPage);
                                            todoController
                                                .get({ page: nextPage })
                                                .then(({ todos, pages }) => {
                                                    setTodos((oldTodos) => {
                                                        return [
                                                            ...oldTodos,
                                                            ...todos,
                                                        ];
                                                    });
                                                    setTotalPages(pages);
                                                })
                                                .finally(() => {
                                                    setIsLoading(false);
                                                });
                                        }}
                                    >
                                        Pagina {page}, Carregar mais{" "}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginLeft: "4px",
                                                fontSize: "1.2em",
                                            }}
                                        >
                                            ↓
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </main>
    );
}
