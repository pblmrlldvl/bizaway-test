import { Router } from 'express'

import { deleteSavedTrip, getTrips, listAllSavedTrips, saveTrip } from './trips.controller'
import requestValidator from '../../middlewares/request-validator.middleware'
import { GetTripsQueryInputDto } from './dtos'
import SaveTripInputDto from './dtos/save-trip.input.dto'

export const tripsRouter = Router()

tripsRouter
  .route('/')
  .get(requestValidator('query', GetTripsQueryInputDto), getTrips)
tripsRouter
  .route('/saved')
  .get(listAllSavedTrips)
tripsRouter
  .route('/saved')
  .post(requestValidator('body', SaveTripInputDto), saveTrip)
tripsRouter
  .route('/saved/:id')
  .delete(deleteSavedTrip)

