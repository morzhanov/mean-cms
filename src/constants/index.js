/* eslint-disable max-len */
module.exports = {
  API_URI: '/api',
  PORT: process.env.PORT || 8080,
  MONGO_URL: 'mongodb://vlad_morzhanov:rMk2133352#@generalcluster-shard-00-00-cu9lx.mongodb.net:27017,generalcluster-shard-00-01-cu9lx.mongodb.net:27017,generalcluster-shard-00-02-cu9lx.mongodb.net:27017/admin?replicaSet=GeneralCluster-shard-0&ssl=true&authSource=admin',
  SECRET: 'cmsmeanapp',
  FACEBOOK_APP_ID: '225989431092512',
  FACEBOOK_SECRET: '96062c31928f0390cbe22b0e9002a767',
  SC: {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    SERVER_ERROR: 500
  },
  EC: {
    SERVER_ERROR: 0,
    NOT_OUR_APP: 1,
    DATA_NOT_PROVIDED: 2,
    TRY_OTHER_AUTH: 3,
    USER_EXISTS: 4,
    WRONG_PASSWORD: 5,
    WRONG_EMAIL: 6,
    DATA_VALIDATION_FAILED: 7,
    DATA_NOT_FOUND: 8,
    DATA_NOT_SAVED: 9
  },
  MIME_TYPES: {
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    GIF: 'image/gif',
    BMP: 'image/bmp'
  }
}
