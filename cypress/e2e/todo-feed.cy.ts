const BASE_URL = "http://localhost:3000";

describe("/ - Todos Feed", () => {
    it("when load, renders the page", () => {
        cy.visit(BASE_URL);
    });
    it("when create a todo, it must appears in the screen", () => {
        cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
            request.reply({
                statusCode: 201,
                body: {
                    todo: {
                        id: "5b9c1492-e111-4670-a5d7-aad2d7f269d8",
                        date: "2023-05-29T22:20:58.455Z",
                        content: "Test Todo",
                        done: false,
                    },
                },
            });
        }).as("CreateTodo");

        cy.visit(BASE_URL);
        const inputAddTodo = "input[name='add-todo']";
        cy.get(inputAddTodo).type("Test Todo");
        const buttonAddTodo = "[aria-label='Adicionar novo item']";
        cy.get(buttonAddTodo).click();

        cy.get("table > tbody").contains("Test Todo");

        expect("texto").to.be.equal("texto");
    });
});
