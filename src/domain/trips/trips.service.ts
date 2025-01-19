import ExternalServiceError from "../shared/domain-errors/external-service-error"
import Trips from "./trips.types"

export class TripsService implements Trips.TripsServiceInterface {
  constructor(private tripsApi: Trips.TripsApiInterface) { }

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
}

export default TripsService