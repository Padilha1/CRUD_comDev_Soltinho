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
    const [todos, setTodos] = React.useState<HomeTodo[]>([]);

    React.useEffect(() => {
        todoController.get().then((todos) => {
            setTodos(todos);
        });
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
                <form>
                    <input type="text" placeholder="Kimetsu no Yaiba..." />
                    <button type="submit" aria-label="Adicionar novo item">
                        +
                    </button>
                </form>
            </header>

            <section>
                <form>
                    <input type="text" placeholder=" Filtrar lista atual" />
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
                        {todos.map((currentTodo) => {
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

                        {/* <tr>
                            <td
                                colSpan={4}
                                align="center"
                                style={{ textAlign: "center" }}
                            >
                                Carregando...
                            </td>
                        </tr> */}

                        {/* <tr>
                            <td colSpan={4} align="center">
                                Nenhum item encontrado
                            </td>
                        </tr> */}

                        <tr>
                            <td
                                colSpan={4}
                                align="center"
                                style={{ textAlign: "center" }}
                            >
                                <button data-type="load-more">
                                    Carregar mais{" "}
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
                    </tbody>
                </table>
            </section>
        </main>
    );
}
