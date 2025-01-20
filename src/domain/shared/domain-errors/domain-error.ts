import DomainErrors from './domain-errors.enum'

export default class DomainError extends Error {
  public code: DomainErrors
  constructor(error: string | Error, code: DomainErrors) {
    super(error instanceof Error ? error.message : error)
    this.code = code || DomainErrors.UNKNOWN_ERROR
  }
}
