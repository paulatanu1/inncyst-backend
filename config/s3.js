const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_PROJECT_DIGITIZER_S3_BUCKET_LOCATION;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region: region,
});

const uploadFileToS3 = async (bucketName, buffer, filename, contentType) => {
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);
};

const getFileFromS3 = async (bucketName, fileName) => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

const deleteFilesFromS3 = async (bucketName, fileName) => {
  const command = new DeleteObjectCommand({ Bucket: bucketName, Key: fileName });
  await s3.send(command);
};

module.exports = {uploadFileToS3, getFileFromS3, deleteFilesFromS3}