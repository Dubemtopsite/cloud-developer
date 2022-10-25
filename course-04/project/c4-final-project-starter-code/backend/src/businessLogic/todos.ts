// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils';
// import * as createError from 'http-errors'

import { TodoItem } from "../models/TodoItem";
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createTodo, deleteTodoItemById, getTodoItemById, getTodoItemsByUserId, updateMultipleTodoItem, updateTodoItem } from '../dataLayer/todosAcess';
import { getUploadSignedUrl } from '../helpers/attachmentUtils';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const bucket_name = process.env.ATTACHMENT_S3_BUCKET

// // TODO: Implement businessLogic
export async function buildTodoItem(todoRes: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {
    const todoIitem: TodoItem = {
        "todoId": uuid.v4(),
        "userId": getUserId(event),
        "createdAt": new Date().toISOString(),
        "name": todoRes.name,
        "dueDate": todoRes.dueDate,
        "done": false,
        "attachmentUrl": "http://example.com/image.png"
    }
    const createTodoItem = await createTodo(todoIitem)
    return createTodoItem;
}

export async function getAllTodoItems(event: APIGatewayProxyEvent): Promise<TodoItem[]>{
    const allTodoList = await getTodoItemsByUserId(getUserId(event))
    return allTodoList
}

export async function generateAnUploadUrl(todoId: string): Promise<string>{
    const todoItem = await getTodoItemById(todoId)
    todoItem.attachmentUrl = `https://${bucket_name}.s3.amazonaws.com/${todoItem.todoId}`
    await updateTodoItem(todoItem)
    const url = await getUploadSignedUrl(todoId)
    return url
}

export async function updateTodoItemById(todoId: string, event: APIGatewayProxyEvent){
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const todoItem = await getTodoItemById(todoId)
    await updateMultipleTodoItem(updatedTodo, todoId, todoItem.userId)
}

export async function deleteTodoItem(todoId: string){
    const todoItem = await getTodoItemById(todoId)
    // TODO: Remove a TODO item by id
    await deleteTodoItemById(todoId, todoItem.userId)
}