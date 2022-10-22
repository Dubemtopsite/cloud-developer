import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
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
      Item: todoIitem
    }).promise()

    return todoIitem
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