import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoUpdate } from '../models/TodoUpdate';

import { TodoItem } from "../models/TodoItem"

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic

const todosTable = process.env.TODOS_TABLE
const docClient: DocumentClient = createDynamoDBClient()

export async function createTodo (todoIitem: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todoIitem,
    }).promise()

    return todoIitem
}

export async function getTodoItemsByUserId(userId: string){
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  return result.Items
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