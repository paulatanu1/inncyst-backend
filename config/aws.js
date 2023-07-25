const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.AWS_PROJECT_DIGITIZER_S3_BUCKET;
const region = process.env.AWS_PROJECT_DIGITIZER_S3_BUCKET_LOCATION;

const uploadFileToS3 = async (file, filePath) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    },
    region: region
  });

  const params = {
    Bucket: bucketName,
    Key: filePath,
    Body: file,
  };
  return await s3.upload(params).promise();
};

module.exports = { uploadFileToS3 };
