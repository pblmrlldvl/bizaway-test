import { Router } from 'express'

import { getTrips } from './trips.controller'
import requestValidator from '../../middlewares/request-validator.middleware'
import { GetTripsQueryInputDto } from './dtos'

export const tripsRouter = Router()

tripsRouter
  .route('/')
  .get(requestValidator('query', GetTripsQueryInputDto), getTrips)
