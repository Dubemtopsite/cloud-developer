var AWS = require('aws-sdk');
//const AWSXRay = require('aws-xray-sdk')

//const XAWS = AWSXRay.captureAWS(AWS)
//const urlExpiration = process.env.SIGNED_URL_EXPIRATION
//const urlExpiration = process.env.SIGNED_URL_EXPIRATION
var credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey : process.env.S3_SECRET_KEY
};
AWS.config.update({credentials: credentials, region: 'us-east-1'});
const s3 = new AWS.S3({
    signatureVersion: 'v4'
})
const bucket_name = process.env.ATTACHMENT_S3_BUCKET
//const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// TODO: Implement the fileStogare logic
export async function getUploadSignedUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucket_name,
      Key: imageId,
      Expires: 300
    })
  }