import 'dotenv/config'
import 'reflect-metadata'
import cors from 'cors'
import logger from 'morgan'
import helmet from 'helmet'
import express, { json, NextFunction, Request, Response, urlencoded } from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
const appRoot = require('app-root-path')

import { connectClient as connectMongoDb } from './providers/mongodb/mongodb'
import { errorHandler } from './api/middlewares/error-handler.middleware'
import apiRouter from './api/routes'

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 8080

// Load OpenAPI YAML file
const swaggerDocument = YAML.load(path.join(appRoot.toString(), 'openapi.yaml'))

const app = express()
app.set('port', port)
app.use(helmet())
app.use(logger(process.env.LOG_LEVEL || 'dev'))
app.use(json())
app.use(cors())
app.use(urlencoded({ extended: false }))
app.use('/', apiRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

(async () => {
  await connectMongoDb()
  app.listen(app.get('port'), () =>
    console.log(`API running in port ${app.get('port')} | env: ${env}`)
  )
})()
