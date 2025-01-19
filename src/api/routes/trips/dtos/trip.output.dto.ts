import { Expose } from 'class-transformer'
import Trips from '../../../../domain/trips/trips.types'
import { isNil } from 'lodash/fp'

export class TripOutputDto {
  @Expose() origin!: string
  @Expose() destination!: string
  @Expose() cost!: number
  @Expose() duration!: number
  @Expose() type!: string
  @Expose() id!: string
  @Expose() display_name?: string

  static fromDomain(trip: Trips.Trip): TripOutputDto {
    return {
      origin: trip.origin,
      destination: trip.destination,
      cost: trip.cost,
      duration: trip.duration,
      type: trip.type,
      id: trip.id,
      ...(!isNil(trip.displayName) && {display_name: trip.displayName}),
    }
  }
}

export default TripOutputDto
