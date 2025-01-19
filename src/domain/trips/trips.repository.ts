import { identity } from "lodash/fp"

import Trips from "./trips.types"
import BaseRepository from "../shared/base-repository"
import IDataSource from "../shared/data-source.interface"

export default class TripsRepository extends BaseRepository<Trips.Trip, Trips.Trip>{
  constructor(source: IDataSource) {
    super(source, identity)
  }
}