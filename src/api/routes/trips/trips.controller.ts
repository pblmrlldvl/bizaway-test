import { NextFunction, Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'

import TripsApiService from "../../../providers/trips-api/trips-api.service"
import TripsService from "../../../domain/trips/trips.service"
import { GetTripsQueryInputDto, TripOutputDto } from './dtos'
import TripsRepository from '../../../domain/trips/trips.repository'
import MongoDbService from '../../../providers/mongodb/mongodb.service'
import SaveTripInputDto from './dtos/save-trip.input.dto'

const tripsApiService = new TripsApiService()
const tripsRepository = new TripsRepository(new MongoDbService({collectionName: 'trips'}))
const tripsService = new TripsService(tripsApiService, tripsRepository)

export const getTrips = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { origin, destination, sortBy } = req.query as unknown as GetTripsQueryInputDto

    const results = await tripsService.getTrips({ origin, destination, sortBy },)

    const response = plainToInstance(
      TripOutputDto,
      JSON.parse(JSON.stringify(results.map(TripOutputDto.fromDomain))),
      { excludeExtraneousValues: true }
    )
    res.status(200).json(response)
  } catch (e) {
    return next(e)
  }
}

export const saveTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trip = req.body as unknown as SaveTripInputDto

    const result = await tripsService.saveTrip(trip)

    const response = plainToInstance(
      TripOutputDto,
      JSON.parse(JSON.stringify(TripOutputDto.fromDomain(result))),
      { excludeExtraneousValues: true }
    )
    res.status(201).json(response)
  } catch (e) {
    return next(e)
  }
}

export const listAllSavedTrips = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await tripsService.listAllSavedTrips()

    const response = plainToInstance(
      TripOutputDto,
      JSON.parse(JSON.stringify(results.map(TripOutputDto.fromDomain))),
      { excludeExtraneousValues: true }
    )
    res.status(200).json(response)
  } catch (e) {
    return next(e)
  }
}

export const deleteSavedTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const result = await tripsService.deleteSavedTrip(id)
    res.status(result ? 204 : 404)
  } catch (e) {
    return next(e)
  }
}
