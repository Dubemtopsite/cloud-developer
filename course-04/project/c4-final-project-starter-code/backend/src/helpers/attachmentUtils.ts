import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const bucket_name = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// TODO: Implement the fileStogare logic
export async function getUploadSignedUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucket_name,
      Key: imageId,
      Expires: urlExpiration
    })
  }