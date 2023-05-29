/* eslint-disable no-console */
import fs from "fs"; //ES6
import { v4 as uuid } from "uuid";
// const fs = require("fs"); -- CommonJS

const DB_FILE_PATH = "./core/db";

// console.log("[CRUD]");

type UUID = string;

interface Todo {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
}

export function create(content: string): Todo {
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };
    const todos: Array<Todo> = [...read(), todo];

    //salvar content no sistema
    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );

    return todo;
}

export function read(): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

export function update(id: UUID, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));

    if (!updatedTodo) {
        throw new Error("Please, provide new ID!");
    }
    return updatedTodo;
}

function deleteById(id: UUID) {
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {
        if (id === todo.id) {
            return false;
        }
        return true;
    });

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({ todos: todosWithoutOne }, null, 2)
    );
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}

//Simulation
// CLEAR_DB();

// create("Primeira Todo!");
// const secondTodo = create("Segunda Todo!");
// deleteById(secondTodo.id);
// const thirdTodo = create("Terceira TODO!");
// update(thirdTodo.id, { content: "Atualizada", done: true });

// const todos = read();
// console.log(todos);
// console.log(todos.length);
