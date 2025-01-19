import DomainErrors from "../domain/shared/domain-errors.enum"

export const statusCodesMap: Record<DomainErrors, number> = {
  [DomainErrors.UNKNOWN_ERROR]: 500,
  [DomainErrors.EXTERNAL_SERVICE_ERROR]: 502,
}

export const errorCodesMap: Record<DomainErrors, string> = {
  [DomainErrors.UNKNOWN_ERROR]: 'UNKNOWN_ERROR',
  [DomainErrors.EXTERNAL_SERVICE_ERROR]: 'EXTERNAL_SERVICE_ERROR',
}
