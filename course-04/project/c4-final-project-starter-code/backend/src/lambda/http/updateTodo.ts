import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

//import { updateTodo } from '../../businessLogic/todos'
import { updateTodoItemById } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    if(updatedTodo.name.length === 0 || updatedTodo.dueDate.length === 0 || !updatedTodo.done){
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Incomplete Request Body"
        })
      }
    }
    //const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    await updateTodoItemById(todoId, event)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object


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
