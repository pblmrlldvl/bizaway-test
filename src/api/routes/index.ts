import { Router } from "express"

import { tripsRouter } from "./trips/trips.router"


export const apiRouter = Router()

apiRouter.use('/trips', tripsRouter)

export default apiRouter