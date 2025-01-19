import { NextFunction, Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'

import TripsApiService from "../../../providers/trips-api/trips-api.service"
import TripsService from "../../../domain/trips/trips.service"
import { GetTripsQueryInputDto, TripOutputDto } from './dtos'

const tripsApiService = new TripsApiService()
const tripsService = new TripsService(tripsApiService)

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
