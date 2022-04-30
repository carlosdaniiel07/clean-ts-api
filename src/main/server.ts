import { MongoHelper } from '~/infra/db/mongodb/helpers/mongo-helper'
import env from '~/main/config/env'

MongoHelper.connect(env.MONGO_DB_CONNECTION_STRING)
  .then(async () => {
    const app = (await import('~/main/config/app')).default
    app.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT}!`))
  })
  .catch(console.error)
