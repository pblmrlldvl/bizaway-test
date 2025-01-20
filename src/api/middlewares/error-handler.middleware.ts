import { ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { isArray } from 'lodash/fp'

import DomainError from '../../domain/shared/domain-errors/domain-error'
import DomainErrors from '../../domain/shared/domain-errors/domain-errors.enum'
import { errorCodesMap, statusCodesMap } from '../../api/error-mapper'

export const errorHandler = (e: any, req: Request, res: Response, next: NextFunction) => {
  if (isArray(e) && e[0] instanceof ValidationError) {
    const message = e.map((error) => error.toString() + '\n').toString()
    res.status(400).json({ error: 'VALIDATION_ERROR', message })

    return
  }

  if (e instanceof DomainError) {
    res
      .status(statusCodesMap[e.code] || 500)
      .json({ error: errorCodesMap[e.code], message: e.message })

    return
  }

  return res
    .status(e.statusCode || 500)
    .json({ error: e.error || DomainErrors.UNKNOWN_ERROR, message: e.message })
}
