import { Expose } from 'class-transformer'
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

import Trips from '../../../../domain/trips/trips.types'


export class SaveTripInputDto
  implements Trips.GetTripsParams
{
  @IsString()
  @Expose()
  @IsIn(Trips.originCountryCodesAssertion)
  origin!: Trips.OriginCountryCode

  @IsString()
  @Expose()
  @IsIn(Trips.destinationCountryCodesAssertion)
  destination!: Trips.DestinationCountryCode

  @IsNumber()
  @Expose()
  cost!: number

  @IsNumber()
  @Expose()
  duration!: number

  @IsString()
  @Expose()
  type!: string

  @IsString()
  @Expose()
  id!: string

  @IsString()
  @IsOptional()
  @Expose({ name: 'display_name' })
  displayName?: string
}

export default SaveTripInputDto
