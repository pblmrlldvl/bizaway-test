import DomainError from "./domain-error"
import DomainErrors from "./domain-errors.enum"

export default class ExternalServiceError extends DomainError {
    service: string
    constructor(message: string, service: string) {
        super(message, DomainErrors.EXTERNAL_SERVICE_ERROR)
        this.service = service
    }
}