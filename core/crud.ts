import fs from "fs"; //ES6
import { v4 as uuid } from "uuid";
// const fs = require("fs"); -- CommonJS

const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");

interface Todo {
	id: string;
	date: string;
	content: string;
	done: boolean;
}

function create(content: string): Todo {
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

function read(): Array<Todo> {
	const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
	const db = JSON.parse(dbString || "{}");
	if (!db.todos) {
		return [];
	}
	return db.todos;
}

function update(id: string, partialTodo:Partial<Todo>): Todo{
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if(isToUpdate){
           updatedTodo = Object.assign(currentTodo, partialTodo)
        }
    });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({todos}, null, 2))

    if(!updatedTodo){
        throw new Error("Please, provide new ID!")
    }
    return updatedTodo;
}



function CLEAR_DB() {
	fs.writeFileSync(DB_FILE_PATH, "");
}

//Simulation
CLEAR_DB();
create("Primeira Todo!");
create("Primeira Todo!");
const terceiraTodo = create("Segunda TODO!");
update(terceiraTodo.id, {content: "Segunda Todo com new content", done: true})
console.log(read());
