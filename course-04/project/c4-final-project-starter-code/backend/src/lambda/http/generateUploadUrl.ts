import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodoItemById, updateTodoItem } from '../../dataLayer/todosAcess'
import { getUploadSignedUrl } from '../../helpers/attachmentUtils'

//import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
//import { getUserId } from '../utils'
const bucket_name = process.env.ATTACHMENT_S3_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todoItem = await getTodoItemById(todoId)
    todoItem.attachmentUrl = `https://${bucket_name}.s3.amazonaws.com/${todoItem.todoId}`
    await updateTodoItem(todoItem)
    const url = await getUploadSignedUrl(todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
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
