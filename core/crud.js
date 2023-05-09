const fs = require("fs");

const DB_FILE_PATH = "./core/db";

console.log("[CRUD]");


function create (content) {
    //salvar content no sistema
    fs.writeFileSync(DB_FILE_PATH, content)  

    return content;
}


create("Today we need to do...")