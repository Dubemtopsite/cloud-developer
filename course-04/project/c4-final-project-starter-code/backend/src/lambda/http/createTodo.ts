import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../dataLayer/todosAcess'
import { buildTodoItem } from '../../businessLogic/todos'
//import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    console.log(newTodo)
    const todoIitem = buildTodoItem(newTodo, event)
    // TODO: Implement creating a new TODO item
    const createTodoItem = await createTodo(todoIitem)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: createTodoItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
