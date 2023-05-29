import { todoRepository } from "@server/repository/todo";
import { z as schema } from "zod";
import { NextApiRequest, NextApiResponse } from "next";

async function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);
    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: "Page must be a number",
            },
        });
        return;
    }
    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: "Limit must be a number",
            },
        });
        return;
    }

    const output = todoRepository.get({
        page,
        limit,
    });

    res.status(200).json(output);
}

const TodoCreateBodySchema = schema.object({
    content: schema.string(),
});

async function create(req: NextApiRequest, res: NextApiResponse) {
    const body = TodoCreateBodySchema.safeParse(req.body);

    if (!body.success) {
        res.status(400).json({
            error: {
                message: "You need to provide a content to create a Todo",
                description: body.error,
            },
        });
        return;
    }
    const createdTodo = await todoRepository.createByContent(body.data.content);

    res.status(201).json({
        todo: createdTodo,
    });
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
    const todoId = req.query.id;

    if (!todoId || typeof todoId !== "string") {
        res.status(400).json({
            error: {
                message: "You must provide a string Id",
            },
        });
        return;
    }

    try {
        const updatedTodo = await todoRepository.toggleDone(todoId);

        res.status(200).json({
            todo: updatedTodo,
        });
    } catch (err) {
        if (err instanceof Error) {
            res.status(404).json({
                error: {
                    message: err.message,
                },
            });
        }
    }
}

export const todoController = {
    get,
    create,
    toggleDone,
};
