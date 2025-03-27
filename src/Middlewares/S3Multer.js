const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require('dotenv').config();
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;


const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  signatureVersion: "v4",
});

const upload = (path) => {
  const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: Bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {

        const uniqueFileName = Date.now().toString() + '-' + file.originalname.replace(/[^A-Za-z0-9_.-]/g, '_');
        console.log("uniqueFileName",uniqueFileName);
        
        path ? cb(null, path + '/' + uniqueFileName) : cb(null, uniqueFileName);

      },
    }),
  });
  
  return upload;
};

const getPresignedUrl = async (Key) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentType: 'image/jpeg',
  });
  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return url
  } catch (err) {
    console.log('Error generating presigned URL:', err);
    throw err;
  }

}

const deleteimage = async (Key) => {
  const command = new DeleteObjectCommand({
    Bucket,
    Key
  });
  try {
    const response = await s3Client.send(command);
    return response
  } catch (error) {
    console.log('Error deleting image:', error.message);
    throw error;
  }
}

module.exports = {
  upload,
  getPresignedUrl,
  deleteimage,
}