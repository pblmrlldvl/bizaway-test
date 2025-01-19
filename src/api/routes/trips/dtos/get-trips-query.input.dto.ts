import { Expose } from 'class-transformer'
import { IsIn, IsOptional, IsString } from 'class-validator'

import Trips from '../../../../domain/trips/trips.types'


export class GetTripsQueryInputDto
  implements Trips.GetTripsParams
{
  @Expose()
  @IsString()
  @IsIn(Trips.originCountryCodesAssertion)
  origin!: Trips.OriginCountryCode

  @Expose()
  @IsString()
  @IsIn(Trips.destinationCountryCodesAssertion)
  destination!: Trips.DestinationCountryCode

  @IsString()
  @IsOptional()
  @Expose({ name: 'sort_by' })
  @IsIn(Trips.getTripsSortByCriteriaAssertion)
  sortBy?: Trips.GetTripsSortByCriteria
}

export default GetTripsQueryInputDto
