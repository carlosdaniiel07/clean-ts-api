import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(path.join(__dirname, '..', 'routes')).map(async (file) => {
    const isTestFile = file.includes('.test.ts')

    if (!isTestFile) {
      (await import(path.join(__dirname, '..', 'routes', file))).default(router)
    }
  })
}
