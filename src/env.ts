export const env = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mmo_app',
  JWT_SECRET: process.env.JWT_SECRET || 'ASDnkwlj2lkL@L1lk213j',
  DAEMON_PORT: process.env.PORT || process.env.$PORT || 3000,
  DAEMON_HOST: process.env.HOST || process.env.$HOST || 'localhost',
};
