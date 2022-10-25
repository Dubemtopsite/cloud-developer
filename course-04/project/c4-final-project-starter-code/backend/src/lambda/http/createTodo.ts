import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { buildTodoItem } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    //Check if the body has an emtpy value
    if(newTodo.name.length === 0 || newTodo.dueDate.length === 0){
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Incomplete Request Body"
        })
      }
    }
    const createTodoItem = await buildTodoItem(newTodo, event)
    // TODO: Implement creating a new TODO item
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
