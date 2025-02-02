import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodoItem } from '../../businessLogic/todos'

//import { deleteTodo } from '../../businessLogic/todos'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    await deleteTodoItem(todoId)
    // TODO: Remove a TODO item by id
    
    return {
      statusCode: 200,
      body: JSON.stringify({})
    } 
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
