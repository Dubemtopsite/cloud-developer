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

// // TODO: Implement businessLogic
export function buildTodoItem(todoRes: CreateTodoRequest, event: APIGatewayProxyEvent) {
    const todoIitem: TodoItem = {
        "todoId": uuid.v4(),
        "userId": getUserId(event),
        "createdAt": new Date().toISOString(),
        "name": todoRes.name,
        "dueDate": todoRes.dueDate,
        "done": false,
        "attachmentUrl": "http://example.com/image.png"
    }
    return todoIitem;
}