import { isNil } from "lodash/fp"

import ExternalServiceError from "../shared/domain-errors/external-service-error"
import TripsRepository from "./trips.repository"
import Trips from "./trips.types"
import PersistenceError from "../shared/domain-errors/persistence-error"

export class TripsService implements Trips.TripsServiceInterface {
  constructor(private tripsApi: Trips.TripsApiInterface, private tripsRepository: TripsRepository) { }

  async getTrips({ origin, destination, sortBy }: Trips.GetTripsParams) {
    let result = []
    try {
      result = await this.tripsApi.getTrips(origin, destination)
    } catch (error: any) {
      throw new ExternalServiceError(error.message || error.msg || 'External service error', 'TripsApi')
    }

    const sortOrder = sortBy || process.env.GET_TRIPS_DEFAULT_SORT_BY! || 'cheapest'
    result.sort((a, b) => {
      if (sortOrder === 'cheapest') {
        return a.cost - b.cost
      } else {
        return a.duration - b.duration
      }
    })

    return result
  }

  async saveTrip(trip: Trips.Trip): Promise<Trips.Trip> {
    try {
      const result = await this.tripsRepository.create(trip)
      if (isNil(result)) throw new PersistenceError("Error saving Trip into database")
      return result
    } catch (e: any) {
      throw new PersistenceError(e.msg || e.message || 'Unknown error')
    }
  }

  async listAllSavedTrips(): Promise<Array<Trips.Trip>> {
    try {
      return await this.tripsRepository.getAll({})
    } catch (e: any) {
      throw new PersistenceError(e.msg || e.message || 'Unknown error')
    }
  }

  async deleteSavedTrip(id: Trips.Trip['id']): Promise<boolean> {
    try {
      return await this.tripsRepository.deleteById(id)
    } catch (e: any) {
      throw new PersistenceError(e.msg || e.message || 'Unknown error')
    }
  }
}

export default TripsService