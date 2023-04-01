const uuid = require("uuid").v4;
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");

exports.s3UploadV3 = (file) => {
  const s3client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
    },
  });

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}-${file.originalname}`,
    Body: file.buffer,
  };

  return s3client.send(new PutObjectCommand(param));
};

exports.s3UploadV2 = (file, type) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  });

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: type,
  };

  return s3.upload(param).promise();
};
