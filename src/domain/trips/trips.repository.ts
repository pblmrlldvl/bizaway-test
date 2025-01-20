import { identity, isEqual, isNil, pick } from "lodash/fp"

import Trips from "./trips.types"
import BaseRepository from "../shared/base-repository"
import { IDataSource } from "../shared/types"
import Trip from "./Trip"

export default class TripsRepository extends BaseRepository<Trips.Trip, Trip>{
  constructor(source: IDataSource) {
    super(source, (x) => new Trip(x), pick(['origin', 'destination', 'cost', 'duration', 'type', 'id', 'displayName']))
  }

  async create(values: Trips.Trip): Promise<Trip | null> {
    const trip = new Trip(values)
    
    const existing = await this.getById(values.id)
    if (existing?.equals(trip)) return existing

    const result = await super.create(trip)
    if(isNil(result)) return result

    return this.fromDataBase(result)
}
}