export default {
  MONGO_DB_CONNECTION_STRING: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-ts-api',
  PORT: process.env.PORT ?? 3000,
  JWT_SECRET_KEY: 'my-secret-key'
}
