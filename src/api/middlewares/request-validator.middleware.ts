import { transformAndValidateSync } from 'class-transformer-validator'
import { NextFunction, Request, Response } from 'express'

export type Fields = 'body' | 'query' | 'params' | 'headers'

export const requestValidator = (field: Fields, dto: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req[field] = transformAndValidateSync(dto, req[field], {
      transformer: { excludeExtraneousValues: true, exposeUnsetFields: false }
    })
    return next()
  }
}

export default requestValidator
