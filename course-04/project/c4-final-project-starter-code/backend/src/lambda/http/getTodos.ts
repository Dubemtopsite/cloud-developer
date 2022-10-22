import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodoItemsByUserId } from '../../helpers/todosAcess'
import { getUserId } from '../utils'

//import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const allTodoList = await getTodoItemsByUserId(getUserId(event))

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items: allTodoList
        })
      }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
