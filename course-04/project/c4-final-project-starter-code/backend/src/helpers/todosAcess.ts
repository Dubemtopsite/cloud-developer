import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoUpdate } from '../models/TodoUpdate';

import { TodoItem } from "../models/TodoItem"
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic

const todosTable = process.env.TODOS_TABLE
const todoIndex = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

export async function createTodo (todoIitem: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todoIitem,
    }).promise()

    return todoIitem
}

export async function getTodoItemsByUserId(userId: string): Promise<TodoItem[]> {
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  const items = result.Items
  return items as TodoItem[]
}

export async function getTodoItemById(itemId: string): Promise<TodoItem> {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: todoIndex,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': itemId
    }
  }).promise()
  const items = result.Items
  if(items.length !== 0) return result.Items[0] as TodoItem
  return null
}

export async function updateTodoItem(todoIitem: TodoItem): Promise<TodoItem> {
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId: todoIitem.userId,
      todoId: todoIitem.todoId,
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': todoIitem.attachmentUrl
    }
  }).promise()
  
  return result.Attributes as TodoItem
}

export async function updateMultipleTodoItem(todoIitem: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId,
    },
    UpdateExpression: 'set dueDate = :dueDate, #itemname = :name, done = :done',
    ExpressionAttributeValues: {
      ':dueDate': todoIitem.dueDate,
      ':name': todoIitem.name,
      ':done': todoIitem.done
    },
    ExpressionAttributeNames: {
      "#itemname": "name"
    }
  }).promise()
  
  return result.Attributes as TodoItem
}

export async function deleteTodoItemById(todoId: string, userId: string): Promise<TodoItem> {
  const result = await docClient.delete({
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId,
    }
  }).promise()
  return result.Attributes as TodoItem
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}